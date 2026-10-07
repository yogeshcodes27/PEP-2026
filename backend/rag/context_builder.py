from pathlib import Path
import json

import duckdb
import faiss
from sentence_transformers import SentenceTransformer


BACKEND_DIR = Path(__file__).resolve().parents[1]

DB_PATH = BACKEND_DIR / "data" / "detections.duckdb"
INDEX_PATH = BACKEND_DIR / "rag_index" / "index.faiss"
META_PATH = BACKEND_DIR / "rag_index" / "metadata.json"

EMBEDDING_MODEL = "all-MiniLM-L6-v2"
_model = None
_index = None
_metadata = None


def get_resources():
    global _model, _index, _metadata
    if _model is None:
        _model = SentenceTransformer(EMBEDDING_MODEL)
    if _index is None and INDEX_PATH.exists():
        _index = faiss.read_index(str(INDEX_PATH))
    if _metadata is None and META_PATH.exists():
        _metadata = json.loads(META_PATH.read_text(encoding="utf-8"))
    return _model, _index, _metadata


def get_relevant_metrics(question: str):
    question_lower = question.lower()

    dataset = None

    if "iwhr" in question_lower:
        dataset = "IWHR"
    elif "tud" in question_lower:
        dataset = "TUD-GV"

    conn = duckdb.connect(str(DB_PATH))

    if dataset:
        rows = conn.execute(
            """
            SELECT
                model_name,
                evaluation_dataset,
                precision,
                recall,
                f1,
                map50,
                map50_95,
                confidence_threshold,
                inference_ms,
                evaluation_protocol
            FROM model_metrics
            WHERE evaluation_dataset = ?
            ORDER BY
                CASE
                    WHEN model_name = 'YOLO26s-P2-Unified' THEN 0
                    ELSE 1
                END
            """,
            [dataset],
        ).fetchall()
    else:
        rows = conn.execute(
            """
            SELECT
                model_name,
                evaluation_dataset,
                precision,
                recall,
                f1,
                map50,
                map50_95,
                confidence_threshold,
                inference_ms,
                evaluation_protocol
            FROM model_metrics
            WHERE model_name = 'YOLO26s-P2-Unified'
            """
        ).fetchall()

    conn.close()

    return rows


def retrieve_knowledge(question: str, top_k: int = 3):
    if not INDEX_PATH.exists() or not META_PATH.exists():
        return []

    model, index, metadata = get_resources()
    if index is None or metadata is None:
        return []

    query_embedding = model.encode(
        [question],
        convert_to_numpy=True,
        normalize_embeddings=True,
    ).astype("float32")

    scores, indices = index.search(
        query_embedding,
        top_k,
    )

    results = []

    for score, index_id in zip(scores[0], indices[0]):
        if index_id < 0:
            continue

        item = metadata["chunks"][int(index_id)]

        results.append(
            {
                "chunk_id": item["chunk_id"],
                "source": item["source"],
                "section": item["section"],
                "score": float(score),
                "text": item["text"],
            }
        )

    return results


def build_context(question: str):
    metric_rows = get_relevant_metrics(question)
    knowledge = retrieve_knowledge(question)

    parts = []

    parts.append("=== STRUCTURED FACTS FROM DUCKDB ===")

    if metric_rows:
        for row in metric_rows:
            (
                model_name,
                dataset,
                precision,
                recall,
                f1,
                map50,
                map50_95,
                threshold,
                inference_ms,
                protocol,
            ) = row

            parts.append(
                f"""
MODEL: {model_name}
DATASET: {dataset}
Precision: {precision:.4f}
Recall: {recall:.4f}
F1: {f1:.4f}
mAP50: {map50:.4f}
mAP50-95: {map50_95:.4f}
Confidence threshold: {threshold}
Inference: {inference_ms} ms/image
Protocol: {protocol}
"""
            )
    else:
        parts.append("No matching structured metrics found.")

    parts.append("\n=== RETRIEVED KNOWLEDGE FROM FAISS ===")

    if knowledge:
        for item in knowledge:
            parts.append(
                f"""
CHUNK ID: {item['chunk_id']}
SOURCE: {item['source']}
SIMILARITY: {item['score']:.4f}

{item['text']}
"""
            )
    else:
        parts.append("No relevant knowledge found.")

    return "\n".join(parts)

