---
name: graphify
description: Turn any input (code, docs, papers, images, videos) into a persistent knowledge graph with god nodes, community detection, and query/path/explain tools.
license: MIT
---

# Graphify Skill

Use for any question about a codebase, its architecture, file relationships, or project content — especially when `graphify-out/` exists.

## Capabilities
- **Build/Update Graph:** Run `graphify update .` to parse files with AST and build `graphify-out/graph.json` and `graphify-out/graph.html`.
- **Query:** `graphify query "<question>"` to return scoped subgraphs and answers.
- **Path Exploration:** `graphify path "<nodeA>" "<nodeB>"` to trace dependencies and call chains.
- **Explanation:** `graphify explain "<concept>"` to extract definitions, references, and related community members.
- **Wiki Navigation:** Navigate `graphify-out/wiki/index.md` for fast, structured documentation lookup.
