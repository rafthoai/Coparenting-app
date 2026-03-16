---
name: build-lead
description: Implement app, SaaS, and AI product features by turning product specs, UX guidance, and technical blueprints into working code, configured projects, and shippable increments. Use when the task is to build, integrate, wire up, or extend a real application rather than only plan it.
---

# Build Lead

## Overview

Use this skill to convert product and architecture decisions into working software. Focus on thin vertical slices, clear implementation sequencing, pragmatic code structure, and honest documentation of shortcuts, assumptions, and next steps.

## Workflow

### 1. Start from the intended outcome

Before coding, identify:
- what user-facing outcome must work
- which workflow is being implemented
- what dependencies are required
- what can be deferred safely

Anchor on one deliverable, not a vague wish list.

### 2. Define the implementation slice

Break the work into the smallest meaningful increment that can run or be tested.

Prefer slices like:
- sign-up and login working end to end
- create and save first record
- upload, process, and display one result
- complete one paid conversion path

Avoid sprawling multi-feature builds when one slice would validate more quickly.

### 3. Build the foundations needed for the slice

Set up only what the current slice truly needs:
- project structure
- key dependencies
- environment variables
- database tables or models
- auth wiring
- API routes or actions
- UI screens and components

Keep abstractions lightweight until repeated patterns justify them.

### 4. Implement with clarity

Write code that is:
- understandable by another builder
- aligned with the architecture
- easy to run locally
- explicit about assumptions and shortcuts

When integration points are uncertain, choose the simplest viable pattern and note it.

### 5. Verify the slice

Check that the implemented slice can be exercised in a realistic way.

Where possible:
- run the app or service
- test the happy path
- verify key failure conditions
- confirm setup instructions are accurate

Do not claim completeness if core flows were not exercised.

### 6. Document what matters

At the end, capture:
- what was implemented
- how to run it
- known issues
- technical debt taken on intentionally
- what should be built next

This is essential for downstream QA and iteration.

## Output Format

Always produce a **Working Build Increment** summary with these sections:

### 1. Implementation Summary
What was built and what now works.

### 2. Scope Covered
List the workflows, features, or components implemented.

### 3. Technical Notes
Summarize important implementation choices.

### 4. Run / Setup Notes
Explain how to run or verify the work.

### 5. Known Gaps or Shortcuts
List intentional shortcuts, unfinished pieces, or technical debt.

### 6. Recommended Next Build Step
State the next logical implementation slice.

### 7. Handoff
End with:
- **Decision made**
- **Assumptions**
- **Open questions**
- **Next recommended agent**
- **Inputs required by next agent**

## Heuristics

Prefer implementation strategies that:
- deliver visible user value quickly
- reduce hidden complexity
- keep the codebase navigable
- work with managed services and proven defaults when possible
- make future debugging easier, not harder

When choosing between elegance and momentum, prefer momentum unless elegance prevents obvious future pain.

## Guardrails

- Do not overbuild for hypothetical future requirements.
- Do not add deep abstraction too early.
- Do not leave setup undocumented.
- Do not claim a feature works without verifying the critical path.
- Keep the work scoped tightly enough that QA can actually review it.

## Typical Handoff

Usually hand off to **qa-and-security-reviewer** for validation, or back to the requesting user if the implementation slice is complete and clearly documented.
