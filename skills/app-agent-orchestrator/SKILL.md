---
name: app-agent-orchestrator
description: Route app, SaaS, and AI product work across the core sub-agent system by deciding which specialist should handle the current task, what order agents should be used in, what inputs each agent needs, and when to stop planning and start building. Use when coordinating multi-agent idea-to-app execution or when the next best agent is unclear.
---

# App Agent Orchestrator

## Overview

Use this skill to coordinate the app-building agent system from idea through optimization. The orchestrator does not replace the specialist agents; it decides who should act next, what they need, and how to avoid unnecessary handoffs, duplicated work, or premature complexity.

## Core Principle

Optimize for forward progress.

Do not invoke agents just because they exist. Route only to the minimum set of agents required to move the product toward a real outcome.

## Core Agent Roster

### 1. opportunity-strategist
Use for idea quality, market attractiveness, target user clarity, positioning, monetization, and go/no-go judgment.

### 2. product-spec-lead
Use for MVP scope, product requirements, user stories, acceptance criteria, KPIs, and explicit non-goals.

### 3. experience-designer
Use for user flows, screen structure, navigation, interaction rules, and usability-focused interface direction.

### 4. app-architect
Use for stack choice, technical blueprint, system boundaries, schema, auth, APIs, and implementation sequencing.

### 5. build-lead
Use for implementation of features, code structure, integrations, and working product increments.

### 6. qa-and-security-reviewer
Use for release-readiness review, bug finding, reliability checks, and proportionate security assessment.

### 7. launch-operator
Use for release packaging, positioning, app store or landing page copy, launch checklist, measurement setup, and early growth planning.

### 8. analytics-and-optimization-lead
Use for interpreting usage data, funnels, cohorts, monetization, experiment outcomes, and next-step recommendations.

## Routing Workflow

### 1. Classify the current request

Determine whether the user is asking for:
- idea evaluation
- product definition
- UX/flow design
- technical architecture
- implementation
- QA/release review
- launch planning
- post-launch optimization
- multi-step coordination across several of the above

If the request spans several domains, identify the current bottleneck rather than launching every relevant agent at once.

### 2. Find the true next step

Ask:
- What is missing that blocks progress right now?
- What is the narrowest useful artifact needed next?
- Which specialist can produce that artifact best?

Prefer the next decision or deliverable that unlocks downstream work.

### 3. Decide between lean path and full path

Use the **lean path** for fast MVP work:
1. opportunity-strategist
2. product-spec-lead
3. app-architect
4. build-lead
5. launch-operator

Use the **full path** when product complexity or risk justifies it:
1. opportunity-strategist
2. product-spec-lead
3. experience-designer
4. app-architect
5. build-lead
6. qa-and-security-reviewer
7. launch-operator
8. analytics-and-optimization-lead

Bring in experience-designer, qa-and-security-reviewer, and analytics-and-optimization-lead only when they add clear value.

### 4. Prepare the handoff

Before invoking the next specialist, summarize:
- current objective
- known constraints
- important assumptions
- artifacts already available
- exact output needed from the next agent

Do not pass vague or bloated context. Pass only what the next agent needs.

### 5. Stop when the next action is obvious

If the best next step is straightforward, say so directly.

Do not over-orchestrate. The orchestrator should reduce complexity, not add another layer of ceremony.

## Routing Rules

### If the idea is vague or unvalidated
Route to **opportunity-strategist**.

### If the idea is promising but scope is unclear
Route to **product-spec-lead**.

### If the product is defined but UX is confusing
Route to **experience-designer**.

### If the product exists on paper but the technical path is unclear
Route to **app-architect**.

### If the main task is to build working software
Route to **build-lead**.

### If a feature or release candidate needs validation
Route to **qa-and-security-reviewer**.

### If the product is near launch and needs messaging, packaging, or rollout planning
Route to **launch-operator**.

### If the product has usage data and decisions should be data-informed
Route to **analytics-and-optimization-lead**.

## Common Multi-Agent Plays

### Play 1: Raw idea to MVP plan
1. opportunity-strategist
2. product-spec-lead
3. app-architect

### Play 2: Raw idea to build-ready package
1. opportunity-strategist
2. product-spec-lead
3. experience-designer
4. app-architect

### Play 3: Build a feature from an existing product plan
1. build-lead
2. qa-and-security-reviewer

### Play 4: Prepare an MVP for launch
1. qa-and-security-reviewer
2. launch-operator

### Play 5: Post-launch improvement loop
1. analytics-and-optimization-lead
2. product-spec-lead
3. build-lead

## Output Format

Always produce an **Orchestration Plan** with these sections:

### 1. Current Stage
State where the product is in the lifecycle.

### 2. Current Bottleneck
State what is blocking progress right now.

### 3. Recommended Next Agent
Name the next agent to use and why.

### 4. Inputs to Provide
List the exact information or artifacts that next agent needs.

### 5. Expected Output
State what artifact or decision should come back.

### 6. Recommended Sequence
If more than one agent is needed, list the next 2-4 agents in order.

### 7. What to Skip for Now
List agents or workstreams that should not be invoked yet.

### 8. Handoff Package
Provide a compact briefing for the next agent.

## Heuristics

Prefer routing strategies that:
- minimize unnecessary agent hops
- create the next concrete artifact quickly
- keep scope aligned with the product stage
- preserve entrepreneurial speed without sacrificing clarity
- avoid specialist overuse in early MVP phases

## Guardrails

- Do not route to every relevant agent by default.
- Do not invoke downstream agents before upstream ambiguity is resolved enough.
- Do not turn simple work into a heavyweight workflow.
- Do not confuse planning completeness with execution progress.
- Always identify what should be skipped for now.

## Typical Use Cases

Use this skill when:
- the user asks which agent should work next
- the project spans several disciplines and needs coordination
- the team wants a staged plan from idea to launch
- the workflow is becoming too fragmented
- it is unclear whether to keep planning or start building
