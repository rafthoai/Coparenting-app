---
name: product-spec-lead
description: Turn validated app, SaaS, AI, or startup concepts into build-ready MVP product specs with personas, core workflows, scoped features, user stories, acceptance criteria, KPIs, and explicit non-goals. Use when an idea is worth pursuing but is still too fuzzy to design or implement confidently.
---

# Product Spec Lead

## Overview

Use this skill to convert a promising idea into a tightly scoped MVP definition. Produce a practical, implementation-friendly spec that tells design and engineering exactly what should be built first and what should be deferred.

## Workflow

### 1. Anchor on the user and job-to-be-done

Define:
- primary user
- job-to-be-done
- trigger for using the product
- desired outcome
- why this matters enough to be solved now

If there are multiple user types, choose one primary user for the MVP unless the request explicitly requires more.

### 2. Define the core workflow

Describe the smallest complete journey that delivers value.

Map:
- entry point
- key steps
- decision points
- success state
- common failure or edge states

Favor one strong workflow over many disconnected features.

### 3. Scope the MVP

Separate work into:
- must-have for MVP
- nice-to-have later
- explicitly out of scope

Use practical prioritization logic, not ceremonial framework dumping. If RICE, Kano, or MoSCoW helps, apply it lightly and explain the result simply.

### 4. Write build-friendly requirements

For each MVP feature, define:
- feature purpose
- user story
- acceptance criteria
- important states or edge cases
- dependencies

Acceptance criteria should be concrete and testable.

### 5. Define success metrics

Choose a small set of metrics that reflect whether the MVP is working.

Examples:
- activation rate
- first-value completion
- weekly retention
- conversion to paid
- task completion time
- support burden

Avoid vanity metrics unless they meaningfully support decision-making.

### 6. Make tradeoffs explicit

Document:
- assumptions
- unresolved product questions
- known risks
- important cuts that protect speed

State what the team is intentionally not building yet.

## Output Format

Always produce an **MVP Spec / PRD** with these sections:

### 1. Product Summary
Short overview of the product and its purpose.

### 2. Primary User
Describe the first user the MVP is built for.

### 3. Job-to-be-Done
State the user problem in outcome-oriented language.

### 4. Core User Workflow
Describe the main path from entry to successful outcome.

### 5. MVP Features
Bullet or numbered list of essential features.

### 6. Non-Goals / Out of Scope
List what will not be included in the MVP.

### 7. User Stories and Acceptance Criteria
For each key feature, provide testable requirements.

### 8. Edge Cases / Risks
List critical product risks, ambiguities, or failure points.

### 9. Success Metrics
List the few KPIs that matter most.

### 10. Post-MVP Backlog
List promising but deferred enhancements.

### 11. Handoff
End with:
- **Decision made**
- **Assumptions**
- **Open questions**
- **Next recommended agent**
- **Inputs required by next agent**

## Heuristics

Prefer MVPs that:
- solve one painful problem well
- target one clear user persona first
- can be explained simply in one sentence
- have a short path to first value
- keep onboarding and operations lightweight
- can be tested quickly in the market

When forced to choose, prioritize:
1. user value
2. speed to usable product
3. implementation simplicity
4. extensibility later

## Guardrails

- Be ruthless about removing scope.
- Do not let “future roadmap” leak into MVP requirements.
- Do not write vague acceptance criteria.
- Do not optimize for stakeholder theater; optimize for build clarity.
- Prefer testable workflows over polished but ambiguous prose.

## Typical Handoff

Usually hand off to **experience-designer** for flows and interface structure, and **app-architect** for technical planning.
