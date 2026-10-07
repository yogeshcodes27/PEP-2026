# Get Shit Done (GSD) Development Rules

Follow the Get Shit Done (GSD) spec-driven lifecycle when managing projects, roadmaps, phases, or complex multi-step tasks.

## Workflow Phases
1. **Initialize (`SPEC.md`):** Capture the objective, non-goals, architecture constraints, and acceptance criteria.
2. **Discuss (`/discuss-phase <phase>`):** Clarify ambiguities, decide on patterns, and record decisions in `DECISIONS.md`.
3. **Plan (`PLAN.md`):** Break down requirements into atomic, structured XML tasks with clear file targets and verification steps.
4. **Execute (`/execute <phase>`):** Execute plan in waves. Keep edits atomic. Avoid unbounded context bloat.
5. **Verify (`/verify <phase>`):** Check must-haves and capture evidence before completing milestones.

## Context Engineering Principles
- Protect context from rot: Maintain structured markdown files (`SPEC.md`, `ROADMAP.md`, `STATE.md`, `PLAN.md`, `SUMMARY.md`).
- Isolate heavy work: Keep research, execution, and verification modular.
- XML Task Structure:
  ```xml
  <task type="auto">
    <name>Task name</name>
    <files>path/to/target</files>
    <action>Specific steps to take</action>
    <verify>Verification command or check</verify>
  </task>
  ```
