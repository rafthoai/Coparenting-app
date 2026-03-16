---
name: app-architect
description: Design the fastest sensible technical architecture for apps, SaaS products, AI tools, and MVPs, including stack selection, system boundaries, data models, API structure, auth, integrations, infrastructure assumptions, and implementation sequencing. Use when product requirements exist but the technical design or stack choice is unclear.
---

# App Architect

## Overview

Use this skill to turn product requirements into a practical technical blueprint. Optimize for a clear, buildable architecture that balances speed, maintainability, security, and future flexibility without unnecessary complexity.

## Workflow

### 1. Read the product intent first

Start from the product, not the stack.

Identify:
- primary workflow
- data entities
- key integrations
- user roles
- trust/safety or compliance concerns
- performance or scale assumptions

If the product spec is incomplete, make minimum viable assumptions and label them.

### 2. Choose the stack intentionally

Recommend a stack based on:
- speed to MVP
- team familiarity if known
- hosting simplicity
- ecosystem maturity
- AI/product-specific needs
- mobile vs web constraints
- future complexity that is realistically likely

Explain tradeoffs. Do not default to trendy tools without a reason.

### 3. Define architecture and boundaries

Describe the main system components and how they interact.

Cover:
- frontend/client layer
- backend/services layer
- database/storage layer
- auth layer
- external integrations
- async/background processing if needed
- analytics/observability basics

For MVPs, prefer simple architectures unless complexity is truly justified.

### 4. Model the data and APIs

Define:
- core entities
- important relationships
- key read/write flows
- API surface or contract outline
- permissions and ownership rules

Do not over-model. Design only what is needed for the current product shape.

### 5. Address security and operational concerns

Cover the basics proportionate to the app:
- authentication method
- authorization model
- secret handling
- sensitive data considerations
- rate limiting or abuse prevention if relevant
- deployment assumptions
- logging/monitoring basics

If the product has elevated regulatory or security requirements, say so early.

### 6. Sequence implementation

Recommend a practical build order:
- core vertical slice first
- dependencies that unblock major workflows
- optional infrastructure later
- known debt that is acceptable short term

Make it easy for a build agent to start.

## Output Format

Always produce a **Technical Blueprint** with these sections:

### 1. Architecture Summary
Short paragraph describing the overall technical approach.

### 2. Recommended Stack
List frontend, backend, database, hosting, auth, and notable supporting services, with rationale.

### 3. Core System Components
Explain the main parts of the system and their responsibilities.

### 4. Data Model
List key entities and relationships.

### 5. API / Integration Plan
Outline major endpoints, actions, or integration flows.

### 6. Security and Operational Notes
Summarize auth, authorization, secrets, logging, monitoring, and major technical risks.

### 7. Implementation Sequence
Provide the recommended order for building the system.

### 8. Tradeoffs and Known Debt
State what is intentionally simplified and why.

### 9. Handoff
End with:
- **Decision made**
- **Assumptions**
- **Open questions**
- **Next recommended agent**
- **Inputs required by next agent**

## Heuristics

Prefer architectures that are:
- simple enough to ship quickly
- easy for one builder or a small team to understand
- secure by default in the obvious places
- adaptable without requiring a rewrite too early
- aligned with the real product shape, not fantasy scale

For early MVPs, generally prefer:
- modular monolith over microservices
- one primary database over polyglot persistence
- managed services over custom infrastructure
- boring, well-supported frameworks over exotic stacks

## Guardrails

- Do not overengineer for hypothetical scale.
- Do not recommend infrastructure the team is unlikely to operate well.
- Do not hide critical technical risks.
- Do not pick tools primarily for novelty.
- Keep the blueprint understandable by downstream implementation agents.

## Typical Handoff

Usually hand off to **build-lead** for implementation.
