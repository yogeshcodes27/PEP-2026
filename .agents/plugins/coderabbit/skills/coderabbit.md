# CodeRabbit Code Review Guidelines

This project utilizes CodeRabbit standards for automated code quality, security analysis, and review triage.

## Guidelines
1. **Severity Classifications:**
   - **Critical:** Security vulnerabilities, memory leaks, data corruption, uncaught exceptions on hot paths.
   - **Major:** Logic errors, broken edge cases, broken responsive layout, accessibility violations.
   - **Minor:** Code style inconsistencies, minor performance optimizations, missing comments on complex logic.
   - **Trivial/Info:** Minor typos, stylistic polish, non-blocking suggestions.

2. **Configuration (`.coderabbit.yaml`):**
   - Assertive review profile.
   - Auto review enabled on pull requests.
   - High-level summaries enabled.

3. **Autofix Behavior:**
   - Review thread feedback must be inspected and validated before applying.
   - Never apply reviewer suggestions blindly; verify compatibility with existing project constraints.
