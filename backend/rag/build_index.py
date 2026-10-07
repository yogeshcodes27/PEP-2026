from pathlib import Path
import json
import re

import faiss
from sentence_transformers import SentenceTransformer


BACKEND_DIR = Path(__file__).resolve().parents[1]
DOCS_DIR = BACKEND_DIR / "documents"
INDEX_DIR = BACKEND_DIR / "rag_index"

EMBEDDING_MODEL = "all-MiniLM-L6-v2"


def clean(text: str) -> str:
    text = text.replace("\r\n", "\n")
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def split_by_markdown_sections(text: str):
    """
    Split on Markdown headings while keeping the heading
    with the content that follows it.
    """
    text = clean(text)

    matches = list(re.finditer(r"(?m)^#{1,6}\s+.+$", text))

    if not matches:
        return [("General", text)]

    sections = []

    for i, match in enumerate(matches):
        heading = match.group(0).strip()
        start = match.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(text)

        body = text[start:end].strip()

        if body:
            sections.append((heading, body))

    return sections


def split_large_text(text: str, max_words: int = 120, overlap: int = 20):
    words = text.split()

    if len(words) <= max_words:
        return [text]

    chunks = []
    start = 0

    while start < len(words):
        end = min(start + max_words, len(words))
        chunks.append(" ".join(words[start:end]))

        if end >= len(words):
            break

        start = end - overlap

    return chunks


def load_documents():
    records = []

    for path in sorted(DOCS_DIR.glob("*.md")):
        raw = clean(path.read_text(encoding="utf-8"))

        sections = split_by_markdown_sections(raw)

        for section_name, section_text in sections:
            subchunks = split_large_text(section_text)

            for i, chunk in enumerate(subchunks):
                records.append(
                    {
                        "chunk_id": f"{path.stem}_{len(records):04d}",
                        "source": path.name,
                        "section": section_name,
                        "text": chunk.strip(),
                    }
                )

    return records


def main():
    INDEX_DIR.mkdir(parents=True, exist_ok=True)

    records = load_documents()

    if not records:
        raise RuntimeError(
            f"No Markdown documents found in {DOCS_DIR}"
        )

    print("=" * 60)
    print("ROBUSTFLOAT | BUILDING SECTION-BASED VECTOR STORE")
    print("=" * 60)

    print("Documents :", len(list(DOCS_DIR.glob("*.md"))))
    print("Chunks    :", len(records))
    print("Embedding :", EMBEDDING_MODEL)

    model = SentenceTransformer(EMBEDDING_MODEL)

    texts = [r["text"] for r in records]

    embeddings = model.encode(
        texts,
        convert_to_numpy=True,
        normalize_embeddings=True,
        show_progress_bar=True,
    ).astype("float32")

    dimension = embeddings.shape[1]

    # Normalized embeddings + inner product = cosine similarity.
    index = faiss.IndexFlatIP(dimension)
    index.add(embeddings)

    index_path = INDEX_DIR / "index.faiss"
    metadata_path = INDEX_DIR / "metadata.json"

    faiss.write_index(index, str(index_path))

    metadata = {
        "embedding_model": EMBEDDING_MODEL,
        "dimension": dimension,
        "metric": "cosine_similarity_via_normalized_inner_product",
        "chunks": records,
    }

    metadata_path.write_text(
        json.dumps(metadata, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )

    print("\n" + "=" * 60)
    print("VECTOR STORE CREATED")
    print("=" * 60)
    print("FAISS index :", index_path)
    print("Metadata    :", metadata_path)
    print("Vectors     :", index.ntotal)
    print("Dimension   :", dimension)
    print("Metric      : cosine similarity")
    print("=" * 60)


if __name__ == "__main__":
    main()
