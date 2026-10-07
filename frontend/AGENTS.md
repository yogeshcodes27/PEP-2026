<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Active Installed Plugins

The following plugins are installed and active in this workspace via `.agents/plugins/`:

1. **Ponytail** (`.agents/plugins/ponytail`):
   - Minimalist senior developer ruleset.
   - Enforces YAGNI, standard library usage, native platform APIs, and shortest working diffs.
   - Intensity levels: `lite`, `full` (default), `ultra`.

2. **Get Shit Done (GSD)** (`.agents/plugins/get-shit-done`):
   - Spec-driven lifecycle framework (`SPEC.md`, `ROADMAP.md`, `PLAN.md`, `STATE.md`).
   - Wave-based execution and verification.

3. **CodeRabbit** (`.agents/plugins/coderabbit`):
   - Automated AI-powered code reviews, security scans, and PR review thread autofixes.
   - Configured via `.coderabbit.yaml`.

4. **Graphify** (`.agents/plugins/graphify`):
   - AST knowledge graph indexing, architecture review, and query/path/explain tooling.
