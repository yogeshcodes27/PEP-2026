---
name: autofix
description: Safely review and apply CodeRabbit PR review-thread feedback and suggested code fixes with validation.
metadata:
  version: "0.1.0"
---

# CodeRabbit Autofix

Review, validate, and apply fixes for issues raised during automated CodeRabbit reviews.

## Workflow
1. **Identify Issues:** Collect issues flagged during code reviews or pull request threads.
2. **Validate Fix:** Verify that proposed changes solve the root issue without introducing regressions or extra dependencies.
3. **Apply & Verify:** Apply code edits cleanly, test builds and lints, and ensure all tests pass.
