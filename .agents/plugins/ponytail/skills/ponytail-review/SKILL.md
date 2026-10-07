---
name: ponytail-review
description: Audit git diffs or proposed code changes for over-engineering, unnecessary abstractions, boilerplate, and dependency bloat.
argument-hint: "[commit-hash|branch-name]"
license: MIT
---

# Ponytail Code Review

Audit diffs against the Ponytail minimalist standard.

## Review Steps
1. **YAGNI Check:** Did this feature request justify all new code, or was speculative behavior added?
2. **Re-invention Check:** Did the diff re-implement something already present in the codebase or standard library?
3. **Abstraction Audit:** Are there single-implementation interfaces, premature factories, or unused configurability?
4. **Diff Efficiency:** Can this PR/diff be reduced by 30-50% while preserving 100% of the functional requirements?
5. **Report:** Deliver a brief, ruthlessly minimal verdict pointing out lines to delete or collapse into native calls.
