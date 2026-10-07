# RobustFloat — Methodology

The application combines computer vision, structured storage, vector retrieval and an LLM.

YOLO26s-P2 Unified performs object detection on uploaded images.

DuckDB stores structured information including image metadata, inference runs, detections, benchmark metrics and human feedback.

The RAG layer stores narrative project knowledge as vector embeddings.

SentenceTransformers is used to create embeddings.

FAISS is used as the local vector index for semantic retrieval.

The LLM receives exact structured facts from DuckDB together with relevant narrative context retrieved from FAISS.

Exact numerical benchmark metrics should come from DuckDB rather than being inferred from semantic retrieval.

The application should not invent numerical values or unsupported claims.
