---
name: gsd
description: Spec-driven lifecycle management for projects, phases, milestones, planning, wave execution, and automated verification.
argument-hint: "[init|plan|execute|verify|status]"
license: MIT
---

# Get Shit Done (GSD) Workflow Skill

Structure, plan, and execute development tasks through the GSD context-engineering lifecycle.

## Commands & Actions

- `gsd init`: Set up `SPEC.md`, `ROADMAP.md`, and project boundaries.
- `gsd plan <phase>`: Generate atomic, dependency-ordered XML execution tasks into `PLAN.md`.
- `gsd execute <phase>`: Execute planned tasks sequentially in waves with atomic verification.
- `gsd verify <phase>`: Audit output against acceptance criteria in `SPEC.md`.
- `gsd status`: Print progress across roadmap phases and active milestones.

## Plan XML Specification
```xml
<plan phase="N">
  <task type="auto" id="task-1">
    <name>Component Setup</name>
    <files>components/Feature.tsx</files>
    <action>Implement feature logic</action>
    <verify>npm run build / test command</verify>
  </task>
</plan>
```
