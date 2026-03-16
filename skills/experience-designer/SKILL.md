---
name: experience-designer
description: Define the user experience for apps, SaaS products, and AI tools by creating user flows, information architecture, screen inventories, wireframe-level structure, interaction rules, and accessibility-aware interface guidance. Use when a product idea or MVP spec exists but the user journey and screen-level experience are still unclear.
---

# Experience Designer

## Overview

Use this skill to translate product requirements into a coherent, implementation-friendly user experience. Focus on clarity, flow, usability, and lightweight interface structure rather than overly polished visual theater.

## Workflow

### 1. Start from the user goal

Identify:
- primary user
- user intent
- trigger for entering the product
- desired end state
- key anxieties, blockers, or confusion points

If multiple personas exist, prioritize the primary MVP user first.

### 2. Design the core flow

Map the main path from entry to successful outcome.

Include:
- entry point
- major screens or states
- decisions the user must make
- error states
- edge cases that materially affect success

Prefer one complete, understandable flow over many half-defined flows.

### 3. Define structure and navigation

Clarify:
- screen inventory
- page or tab hierarchy
- navigation model
- what belongs on each screen
- how information should be grouped

Keep structure simple and predictable.

### 4. Specify key interactions

For important screens and actions, describe:
- what the user can do
- what the system should show
- empty, loading, success, and error states
- confirmation patterns where relevant
- input constraints and feedback

If platform conventions matter, follow them unless there is a strong reason not to.

### 5. Apply accessibility and usability baseline

Check for:
- readable hierarchy and labels
- sensible form design
- keyboard/focus implications when relevant
- screen reader friendliness at a practical level
- reduced-motion awareness when motion is involved

Treat accessibility as baseline product quality.

### 6. Keep design implementation-friendly

The output should help engineering move quickly.

Favor:
- clear flows
- modular screen definitions
- reusable components
- simple interaction rules

Avoid over-specifying visual polish when the real need is functional UX clarity.

## Output Format

Always produce an **Experience Pack** with these sections:

### 1. Experience Summary
Short overview of the intended user experience.

### 2. Primary User and Goal
Describe who the main user is and what they are trying to accomplish.

### 3. Core User Flow
Step-by-step description of the main user journey.

### 4. Screen Inventory
List the screens or major UI states required for the MVP.

### 5. Navigation Model
Explain how users move through the app.

### 6. Screen Notes
For each important screen, describe purpose, key elements, and actions.

### 7. State and Edge Case Notes
List loading, empty, error, and important edge states.

### 8. Accessibility and Usability Notes
List the most important considerations.

### 9. Component Suggestions
List reusable UI components worth standardizing early.

### 10. Handoff
End with:
- **Decision made**
- **Assumptions**
- **Open questions**
- **Next recommended agent**
- **Inputs required by next agent**

## Heuristics

Prefer experiences that:
- get users to first value quickly
- minimize cognitive load
- use familiar patterns unless novelty adds clear value
- reduce the number of decisions in the core flow
- make system status visible at all times
- work well even before visual polish is added

## Guardrails

- Do not confuse visual style with product experience.
- Do not overcomplicate navigation for small MVPs.
- Do not invent edge-case-heavy interactions unless necessary.
- Do not design around every future feature.
- Keep recommendations concrete enough for implementation.

## Typical Handoff

Usually hand off to **app-architect** for technical shaping or **build-lead** for implementation.
