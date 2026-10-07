from pathlib import Path
import json

import faiss
from sentence_transformers import SentenceTransformer

BACKEND_DIR = Path(__file__).resolve().parents[1]
INDEX_PATH = BACKEND_DIR / "rag_index" / "index.faiss"
META_PATH = BACKEND_DIR / "rag_index" / "metadata.json"

EMBEDDING_MODEL = "all-MiniLM-L6-v2"


def search(query: str, top_k: int = 3):
    if not INDEX_PATH.exists():
        raise FileNotFoundError(f"FAISS index not found: {INDEX_PATH}")

    if not META_PATH.exists():
        raise FileNotFoundError(f"Metadata not found: {META_PATH}")

    index = faiss.read_index(str(INDEX_PATH))

    metadata = json.loads(
        META_PATH.read_text(encoding="utf-8")
    )

    model = SentenceTransformer(EMBEDDING_MODEL)

    query_embedding = model.encode(
        [query],
        convert_to_numpy=True,
        normalize_embeddings=True,
    ).astype("float32")

    scores, indices = index.search(
        query_embedding,
        min(top_k, index.ntotal),
    )

    print("\n" + "=" * 70)
    print(f"QUERY: {query}")
    print("=" * 70)

    chunks = metadata["chunks"]

    for rank, (score, idx) in enumerate(
        zip(scores[0], indices[0]),
        start=1
    ):
        if idx < 0:
            continue

        item = chunks[int(idx)]

        print(f"\n[{rank}] Similarity: {score:.4f}")
        print(f"Chunk ID : {item['chunk_id']}")
        print(f"Source   : {item['source']}")
        print(f"Section  : {item['section']}")
        print(f"Text     : {item['text']}")

    print("=" * 70)


if __name__ == "__main__":
    question = input("\nAsk: ").strip()

    if not question:
        raise SystemExit("Question cannot be empty.")

    search(question)
