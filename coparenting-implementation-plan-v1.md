# Co-Parenting App Implementation Plan v1

## Purpose

This document translates the existing product documentation into an engineering execution plan. It defines the recommended service boundaries, backend modules, data flow, job orchestration, build sequence, and staged implementation roadmap for the co-parenting app.

It is intended to bridge product architecture and actual development work.

## Documents This Plan Builds On

- MVP blueprint
- app architecture blueprint
- AI feature blueprint
- rules engine specification
- AI-assisted setup UX flow spec
- AI data model extension

---

# 1. Recommended Tech Stack

## Client
- React Native + Expo

## Backend / Application Layer
- TypeScript
- Next.js app/backend or a TypeScript service layer with clear domain modules

## Database
- Postgres

## Auth / Storage / Realtime helpers
- Supabase (recommended for MVP speed)

## Notifications
- Expo push notifications
- Resend or Postmark for email

## Analytics
- PostHog

## Background Jobs
- lightweight queue/job runner
- start simple with app-triggered jobs plus DB-backed job table
- move to dedicated worker if needed as complexity grows

## File Handling
- Supabase Storage or S3-compatible object storage

---

# 2. Engineering Principles

- Ship the core child operations workflow before building premium complexity.
- Keep the backend a modular monolith for MVP.
- Separate AI extraction from deterministic rule application.
- Make important state transitions explicit and auditable.
- Build traceability early because this category needs trust.
- Prefer thin vertical slices over broad unfinished systems.
- Keep admin and support surfaces lightweight unless operational pain proves otherwise.

---

# 3. Recommended Backend Module Boundaries

The backend should be organized by domain, not by UI screen.

## 3.1 Auth and Identity Module
Responsibilities:
- sign up / sign in
- household membership validation
- invite acceptance
- role lookup

Key objects:
- user
- household_member
- invite

## 3.2 Household Setup Module
Responsibilities:
- create household
- add children
- define initial custody setup
- continue solo flow

Key objects:
- household
- child
- custody_template

## 3.3 Calendar Module
Responsibilities:
- create/update/list events
- recurring custody block generation inputs
- handoff markers
- school event import integration

Key objects:
- calendar_event
- schedule_segment
- handoff_event

## 3.4 Rules Engine Module
Responsibilities:
- apply recurring custody rules
- apply holiday overrides
- apply school break/day logic
- apply approved swap exceptions
- generate schedule segments
- detect conflicts
- provide explainability output

Key objects:
- recurring_custody_rule
- holiday_override_rule
- school_break_rule
- exception_rule
- handoff_rule
- rule_conflict

## 3.5 Request Engine Module
Responsibilities:
- create requests
- submit / approve / decline / counter / cancel
- support swap, consent, sign-off, and expense pre-approval flows
- emit activity history and schedule effects where needed

Key objects:
- request
- request_status_history

## 3.6 Messaging Module
Responsibilities:
- thread management
- message creation
- attachment association
- message-to-action conversion support

Key objects:
- message_thread
- message
- attachment

## 3.7 Expense Module
Responsibilities:
- create expenses
- receipt attachments
- reimbursement state tracking
- optional pre-approval via request engine

Key objects:
- expense
- expense_status_history

## 3.8 Timeline Module
Responsibilities:
- child updates
- family photo posts
- timeline feed
- album views

Key objects:
- timeline_post
- attachment

## 3.9 Notification Module
Responsibilities:
- push/email notification dispatch
- notification preference handling later-lite
- pending request reminders
- handoff reminders

Key objects:
- notification
- notification_delivery_log

## 3.10 AI Ingestion and Extraction Module
Responsibilities:
- source document ingestion
- OCR and extraction jobs
- extraction artifacts
- reviewable draft object creation
- ambiguity detection

Key objects:
- source_document
- source_document_text
- source_excerpt
- extraction_job
- extraction_artifact
- draft_rule
- draft_event
- draft_resolution

## 3.11 Export and Audit Module
Responsibilities:
- export generation
- rule and action audit trails
- activity log retrieval

Key objects:
- activity_log
- ai_action_log
- rule_audit_log
- export_job

---

# 4. Service Interaction Model

## 4.1 Core Runtime Flow
1. User performs an action in mobile app
2. API validates auth and household membership
3. Domain module executes action
4. State changes are persisted
5. Activity log is written
6. Notifications and downstream jobs are queued if needed

## 4.2 AI Setup Flow
1. User uploads agreement or school calendar
2. AI ingestion module stores source document
3. Extraction job starts
4. Extraction artifacts are generated
5. Draft rules/events are created
6. User reviews and confirms drafts
7. Confirmed domain objects are created
8. Rules engine regenerates affected schedule window
9. Notifications / dashboard updates reflect new schedule

## 4.3 Swap Approval Flow
1. User creates swap request
2. Request engine stores pending request
3. Other parent approves/counters/declines
4. On approval, exception rule is created
5. Rules engine regenerates affected schedule segment(s)
6. Handoff events update
7. Activity log and notifications are emitted

---

# 5. Job Orchestration Plan

Start with simple job orchestration and evolve only if needed.

## 5.1 Job Types
Recommended initial jobs:
- document text extraction job
- agreement extraction job
- school calendar extraction job
- event extraction job
- schedule regeneration job
- export generation job
- notification fanout job
- summary generation job later

## 5.2 Job Lifecycle
Common states:
- queued
- running
- succeeded
- partially_succeeded
- failed
- cancelled

## 5.3 Recommended MVP Approach
For MVP:
- use DB-backed job records
- trigger jobs from API actions
- process small jobs inline when safe
- push longer-running extraction and regeneration tasks to a worker path

This avoids premature infrastructure complexity.

## 5.4 Scale-Up Path Later
If load grows:
- add dedicated worker process
- introduce Redis-backed queue if needed
- separate extraction worker from app runtime

---

# 6. API Surface by Phase

## Phase 1: Core setup and schedule
APIs:
- create household
- create child
- invite co-parent
- create recurring custody rule
- list generated schedule
- list handoffs

## Phase 2: Calendar and requests
APIs:
- create event
- list events by range
- create request
- approve request
- counter request
- decline request
- list request detail/history

## Phase 3: Messaging and expenses
APIs:
- create thread
- send message
- upload attachment
- create expense
- approve expense pre-approval request
- update reimbursement state

## Phase 4: AI-assisted setup
APIs:
- upload source document
- start extraction job
- get extraction overview
- list draft rules/events
- confirm/edit/skip draft object
- resolve ambiguity
- activate reviewed rules
- regenerate schedule

## Phase 5: Launch hardening
APIs:
- list activity history
- export household records
- list notifications
- mark notifications read
- fetch explainability for schedule day/segment

---

# 7. Database Rollout Sequence

## Wave 1: Core identity and household
Build tables for:
- user
- household
- household_member
- child
- invite

## Wave 2: Calendar and rules foundations
Build tables for:
- calendar_event
- recurring_custody_rule
- holiday_override_rule
- school_break_rule
- handoff_rule
- schedule_segment
- handoff_event

## Wave 3: Requests and messaging
Build tables for:
- request
- request_status_history
- message_thread
- message
- attachment
- activity_log

## Wave 4: Expenses and timeline
Build tables for:
- expense
- expense_status_history
- timeline_post

## Wave 5: AI and review layer
Build tables for:
- source_document
- source_document_text
- source_excerpt
- extraction_job
- extraction_artifact
- draft_rule
- draft_event
- draft_resolution
- domain_object_source_link
- rule_conflict
- ai_action_log
- rule_audit_log

## Wave 6: Notification and export layer
Build tables for:
- notification
- notification_delivery_log
- export_job

---

# 8. Recommended Build Sequence

## Stage 1: Foundation
Build:
- auth
- household creation
- child setup
- simple invite flow
- base schema and app shell

Deliverable:
A user can create a household, add a child, and enter the app.

## Stage 2: Rules engine MVP + generated calendar
Build:
- recurring custody rules
- alternating weekend support
- schedule segment generation
- handoff generation
- month/week views backed by generated schedule

Deliverable:
A household can create and view a real working custody calendar.

## Stage 3: Request engine with swaps
Build:
- request lifecycle
- swap request creation and decision flow
- approved exception rule creation
- schedule regeneration on approval

Deliverable:
Parents can manage schedule changes in a structured way.

## Stage 4: Today + Handoff dashboard
Build:
- current caregiver snapshot
- next handoff display
- pending approvals module
- recent updates placeholder

Deliverable:
The home screen delivers immediate operational value.

## Stage 5: Messaging and attachments
Build:
- household message threads
- attachments
- child context filters
- activity logging

Deliverable:
Parents can communicate inside the app with shared context.

## Stage 6: Expenses
Build:
- create expense
- attach receipt
- split logic
- reimbursement state tracking
- optional request linkage for pre-approval

Deliverable:
Expense tracking becomes part of the same system.

## Stage 7: Family timeline
Build:
- timeline post creation
- child-linked photo/update feed
- album view basics

Deliverable:
The app becomes more child-first and retention-friendly.

## Stage 8: AI-assisted setup v1
Build:
- source document upload
- extraction job infrastructure
- agreement extraction review flow
- school calendar import review flow
- draft-to-confirmed rule activation

Deliverable:
Users can accelerate setup using AI with review and confirmation.

## Stage 9: Launch hardening
Build:
- notifications
- activity history retrieval
- export
- explainability endpoint
- error handling and polish

Deliverable:
The app is reliable enough for real-world launch.

---

# 9. AI Rollout Sequence

AI should not be implemented all at once.

## AI Wave 1
- message-to-action extraction
- thread summaries
- weekly/daily digest

Reason:
These features are lower-risk and do not require the full agreement/rules setup path to be perfect.

## AI Wave 2
- event extraction from flyers/emails/screenshots
- smart search over family history

## AI Wave 3
- agreement extraction
- school calendar extraction
- review and confirmation flows
- rule activation into schedule generation

Reason:
These are high-value but require stable rules engine and review UX first.

---

# 10. Suggested Repo Structure

A practical monorepo layout could be:

- `apps/mobile` – React Native / Expo app
- `apps/web` – optional later admin/support or marketing surface
- `packages/api` – domain services, routes, use cases
- `packages/db` – schema, migrations, query layer
- `packages/shared` – shared types and constants
- `packages/ai` – extraction adapters, prompts, parsers, review helpers
- `packages/rules-engine` – deterministic rule application and schedule generation
- `packages/ui` – optional shared design primitives later

For MVP, this can be simplified further if needed.

---

# 11. Roles for Execution

When using the agent system, recommended execution sequence is:

1. **product-spec-lead**
   - tighten any remaining ambiguities in MVP scope
2. **experience-designer**
   - define flows and screen behavior
3. **app-architect**
   - finalize stack and module boundaries
4. **build-lead**
   - implement stage-by-stage
5. **qa-and-security-reviewer**
   - validate core flows before launch
6. **launch-operator**
   - prepare rollout, messaging, and launch checklist
7. **analytics-and-optimization-lead**
   - guide post-launch iteration

---

# 12. Engineering Risks to Watch

## Product/logic risks
- custody rule edge cases are more complex than expected
- legal-language extraction creates false confidence
- notification timing becomes noisy or stressful
- solo-parent setup differs from dual-parent setup in subtle ways

## Technical risks
- schedule regeneration becomes brittle without clean rule precedence
- partial-day swaps create fragmented segments and handoff edge cases
- messaging and structured actions drift apart conceptually
- source traceability is skipped and later hard to retrofit

## Delivery risks
- trying to ship all modules at once
- adding AI-heavy setup before rules engine is stable
- overbuilding admin or legal workflows too early

---

# 13. Launch Readiness Checklist (Engineering)

Before launch, confirm:
- household creation works cleanly
- generated schedule is explainable
- approved swaps regenerate correctly
- handoffs display correctly
- message and expense data remain household-scoped
- notifications are reliable but not noisy
- attachment access is secure
- export works for core records
- activity history is visible
- core crash/error paths are handled

---

# 14. Recommended Immediate Next Steps

## If starting execution soon
1. Confirm final stack choice
2. Create repo
3. Set up monorepo/app structure
4. Define initial DB schema for Waves 1 and 2
5. Implement Stage 1 foundation
6. Implement rules engine MVP before broader feature spread

## If preparing before code starts
1. finalize screen-by-screen wireframes
2. write initial schema draft
3. define API contracts for rules engine and request engine
4. prepare GitHub repo and branch workflow

---

# 15. GitHub Readiness Notes

When ready to connect GitHub, prepare for:
- monorepo initialization
- branch strategy
- issue/task breakdown by stage
- environment secret management
- CI basics later

Suggested first branches or milestones:
- `foundation-household-auth`
- `rules-engine-mvp`
- `swap-request-engine`
- `today-handoff-dashboard`
- `messaging-attachments`
- `expenses-v1`
- `ai-setup-v1`

This will make the move from planning to execution much smoother.
