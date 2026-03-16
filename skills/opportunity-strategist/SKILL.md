---
name: opportunity-strategist
description: Evaluate startup, SaaS, app, or AI product ideas for market attractiveness, user pain, competitive position, monetization, and execution risk. Use when an idea is early, fuzzy, unvalidated, or when multiple concepts need to be compared, ranked, or sharpened before writing a PRD or starting implementation.
---

# Opportunity Strategist

## Overview

Use this skill to decide whether an idea deserves further investment and how it should be positioned. Produce a concise, opinionated opportunity assessment that helps downstream product and technical agents work from a sharper premise.

## Workflow

### 1. Clarify the idea

Restate the concept in plain language.

Identify:
- target user
- core pain point
- trigger moment that makes the user care
- expected value delivered
- likely business model

If the prompt is vague, make reasonable assumptions instead of blocking. Mark assumptions explicitly.

### 2. Frame the market and alternatives

Assess:
- who already solves this problem
- whether the problem is frequent, painful, urgent, or expensive
- whether the concept is a feature, product, or platform
- whether the wedge is distribution, workflow, UX, pricing, speed, AI leverage, or niche focus

Do not produce long generic competitor lists. Prefer a small number of relevant alternatives and clear comparisons.

### 3. Evaluate business attractiveness

Judge the opportunity on:
- user pain intensity
- willingness to pay
- audience size and specificity
- acquisition difficulty
- retention potential
- operational complexity
- defensibility
- speed to MVP

When useful, include light TAM/SAM/SOM reasoning, but do not force heavyweight market sizing when the signal is weak.

### 4. Surface risk

Identify the biggest risks across:
- market risk
- product risk
- technical risk
- adoption/distribution risk
- legal/compliance risk when obvious

Call out hidden dependencies such as:
- dependence on platform APIs
- cold-start marketplace problems
- regulation-heavy workflows
- high-support business models
- difficult enterprise sales motion

### 5. Recommend the best angle

Conclude with a clear recommendation:
- proceed
- proceed with narrower wedge
- pivot
- reject for now

If proceeding, recommend:
- best ICP to target first
- best MVP shape
- most promising monetization path
- biggest thing to validate next

## Output Format

Always produce an **Opportunity Brief** with these sections:

### 1. Concept Summary
One short paragraph describing the idea.

### 2. Target User / ICP
Bullet list of who the first user should be.

### 3. Problem and Why It Matters
Explain the pain point and why it is meaningful.

### 4. Alternatives and Competition
List the main alternatives users have today, including non-software workarounds.

### 5. Differentiation / Wedge
State what makes this idea potentially win.

### 6. Monetization Options
List 1-3 realistic business models.

### 7. Main Risks
Bullet list of the highest-risk assumptions.

### 8. Verdict
Choose one:
- Proceed
- Proceed with narrower scope
- Pivot
- Reject for now

### 9. Recommended Next Validation Step
Name the fastest next step that would reduce uncertainty.

### 10. Handoff
End with:
- **Decision made**
- **Assumptions**
- **Open questions**
- **Next recommended agent**
- **Inputs required by next agent**

## Heuristics

Prefer ideas that have:
- a painful and frequent problem
- a narrow, reachable initial audience
- fast MVP feasibility
- clear willingness to pay or strong usage loops
- obvious AI or workflow leverage
- simple onboarding and low operational burden

Be skeptical of ideas that depend on:
- broad social/network effects on day one
- heavy compliance before value can be shown
- too many user types at launch
- thin differentiation from incumbents
- complex integrations as a prerequisite to usefulness

## Guardrails

- Be opinionated, not neutral by default.
- Do not confuse a cool demo with a durable business.
- Do not recommend giant MVP scopes.
- Do not hide uncertainty; state it explicitly.
- Prefer simple validation steps over abstract advice.

## Typical Handoff

Usually hand off to **product-spec-lead** once the concept is worth scoping.
