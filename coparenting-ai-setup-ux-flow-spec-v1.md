# Co-Parenting App AI-Assisted Setup UX Flow Specification v1

## Purpose

This document defines the user experience flows for AI-assisted setup and rule review in the co-parenting app. It covers how users upload agreements, import school calendars, review extracted rules and events, resolve ambiguities, and confirm schedule generation.

The goal is to make setup dramatically easier without making the app feel legally presumptuous, opaque, or risky.

## UX Principles

- Reduce setup friction, but do not hide important decisions.
- Make AI feel helpful and transparent, not authoritative.
- Require human confirmation before high-impact schedule changes are applied.
- Keep review flows calm, structured, and editable.
- Surface ambiguity early and clearly.
- Show users what was extracted, what is uncertain, and what happens next.
- Let users continue manually if AI extraction is weak.

---

# 1. Entry Points

Users should be able to enter AI-assisted setup from multiple places.

## Primary Entry Points
- During household onboarding
- From household settings
- From child setup / custody setup wizard
- From an empty calendar state
- From a "Speed up setup with AI" prompt

## Secondary Entry Points
- From agreement/document upload page
- From school calendar import page
- From unresolved schedule setup state
- From an AI suggestions banner after manual setup starts

---

# 2. Top-Level Setup Paths

There should be three main AI-assisted setup paths:

1. **Agreement Import**
2. **School Calendar Import**
3. **Activity / Event Import**

The most important setup path is Agreement Import, followed by School Calendar Import.

---

# 3. Agreement Import Flow

## 3.1 Entry Screen: "Set up from your agreement"

### Purpose
Introduce the feature and set expectations.

### Key UI Elements
- Headline: "Upload your parenting agreement to speed up setup"
- Short explainer: "We’ll suggest custody rules and schedule details for you to review"
- Supported file types: PDF, DOCX, image, scan
- CTA: "Upload agreement"
- Secondary CTA: "Set up manually"

### Important trust copy
Include text like:
- "You’ll review everything before it’s applied"
- "We may flag ambiguous clauses for confirmation"

Avoid legal-authority language.

## 3.2 Upload State

### UI
- File picker / drag-and-drop where supported
- Upload progress
- Optional note if file quality is poor

### Errors to handle
- unsupported file type
- unreadable document
- too large file
- encrypted PDF
- upload interrupted

### Recovery options
- retry upload
- upload clearer file
- continue manual setup

## 3.3 Extraction Processing Screen

### Purpose
Show the system is working and set expectation for review.

### UI copy examples
- "Reading your agreement…"
- "Extracting custody schedule and holiday rules…"
- "Identifying possible ambiguities…"

### Progress sections
- children and household references
- recurring schedule pattern
- holiday rules
- school-day and break rules
- exchange timing details

Do not show the user raw model output.

## 3.4 Extraction Results Overview

### Purpose
Give users a high-level summary before deep review.

### Sections
- Children identified
- Weekly schedule pattern found
- Holiday rules found
- School/break rules found
- Exchange times found
- Items needing review

### Actions
- "Review extracted rules"
- "Edit manually"
- "Start over"

## 3.5 Rule Review Flow

This is the heart of the UX.

### Review categories
1. Child and household references
2. Weekly custody pattern
3. Holiday overrides
4. School/break rules
5. Exchange times and handoff details
6. Ambiguities / unresolved clauses

### Rule card design
Each extracted rule should be shown as a card with:
- plain-language summary
- source excerpt preview where possible
- confidence or certainty indicator
- editable fields
- status badge: ready / needs review / unresolved

### Example rule card
- "Emma is with Parent A every Monday and Tuesday"
- Source: excerpt from uploaded document
- Confidence: High
- Actions: Confirm / Edit / Remove

### Editable fields
- caregiver assignment
- day/date ranges
- alternating logic
- year parity
- time windows
- handoff location if present

## 3.6 Ambiguity Resolution Screen

### Purpose
Handle clauses the system cannot confidently convert.

### Examples of ambiguity
- missing anchor date for alternating weekends
- contradictory holiday clauses
- unclear school-break ownership
- vague time boundaries like "after school"

### UI behavior
For each ambiguity:
- explain what is unclear
- show source text
- present 2-3 structured resolution options if possible
- allow manual entry
- allow defer for later if non-blocking

### Important principle
Never silently guess in high-impact custody logic.

## 3.7 Confirmation Screen

### Purpose
Show the rule set that will be activated.

### Summary sections
- confirmed recurring custody pattern
- confirmed holiday rules
- confirmed school/break rules
- confirmed handoff timing
- unresolved items that will remain manual

### CTAs
- "Generate schedule"
- "Go back and edit"

## 3.8 Schedule Generation Result Screen

### Purpose
Show what was created.

### Elements
- preview of generated calendar
- highlighted handoffs
- upcoming holiday or school exceptions
- note that future changes can be edited
- CTA to continue into app

### Optional follow-up prompt
- "Import your school calendar next"

---

# 4. School Calendar Import Flow

## 4.1 Entry Screen: "Import school calendar"

### Purpose
Explain value clearly.

### UI copy examples
- "Add holidays, no-school days, and planning days automatically"
- "We’ll suggest calendar events for review before importing"

### Inputs supported
- PDF
- image/screenshot
- school website link
- calendar file if available

## 4.2 Upload / Link Capture

### UI elements
- upload file button
- paste school calendar URL
- add note for which child/school this belongs to

## 4.3 Processing Screen

### Status steps
- reading school calendar
- detecting dates and labels
- identifying breaks and special days
- preparing reviewable events

## 4.4 Event Review Screen

### Group imported items by type
- holidays
- no-school days
- teacher planning days
- early release days
- break periods
- school events optional

### Event card elements
- event date/date range
- detected label
- event type
- child association
- editable fields
- source snippet when useful
- confidence indicator

### Actions
- confirm
- edit
- remove
- confirm all high-confidence items

## 4.5 Custody Implication Review

If custody rules already exist, show how imported school events may affect responsibilities.

### Examples
- "Teacher planning day on Monday will be assigned to Parent B based on your confirmed school-day rule"
- "Spring break has no matching rule yet"

### Actions
- accept suggested handling
- create a new school-day rule
- leave as normal calendar event only

## 4.6 Import Confirmation Screen

### Summary
- events to import
- rules triggered
- unresolved items needing later review

### CTA
- "Import to schedule"

---

# 5. Activity and Event Import Flow

## 5.1 Entry Screen
Simple utility-oriented copy:
- "Turn a flyer, email, or screenshot into calendar events"

## 5.2 Extraction Review
Show:
- event name
- date/time
- recurrence if detected
- location
- child
- optional prompt to notify co-parent

## 5.3 Confirmation
Allow:
- save as event
- save as draft
- send for approval if needed

This flow should be lighter and faster than agreement review.

---

# 6. Manual Fallback UX

AI-assisted setup must never become a trap.

At every major step, users should be able to:
- switch to manual setup
- save progress and continue later
- skip uncertain sections
- edit extracted content manually

Manual fallback is especially important when:
- OCR quality is weak
- agreement language is too custom
- school calendar is messy
- users do not trust the extraction

---

# 7. Review State Model in UX

Each extracted item should have a visible review state.

Recommended states:
- **Detected** – extracted but not yet reviewed
- **Needs review** – ambiguous or incomplete
- **Confirmed** – accepted by user
- **Edited** – changed from extracted version
- **Skipped** – intentionally not applied
- **Unresolved** – blocked pending manual clarification

These states should appear consistently across:
- agreement rules
- school calendar events
- activity/event extraction

---

# 8. Trust and Explainability UX

## 8.1 Source visibility
Whenever possible, allow users to inspect the source snippet that led to an extracted rule or event.

## 8.2 Confidence communication
Use confidence language sparingly and clearly.

Examples:
- High confidence
- Needs confirmation
- Ambiguous

Do not use false precision like "92.4% confidence" in the main user flow.

## 8.3 Explanation patterns
Useful explanation copy examples:
- "We found a weekly custody pattern in this section"
- "This date appears to be a teacher planning day"
- "This holiday rule seems to alternate by year"
- "We couldn’t determine the first alternating weekend"

---

# 9. Error and Recovery Patterns

## 9.1 Extraction failure
If extraction fails:
- explain in plain language
- suggest a clearer file or different format
- offer manual setup immediately

## 9.2 Partial extraction
If some content is extracted and some is not:
- preserve successful sections
- flag incomplete parts
- let user continue with partial setup

## 9.3 Conflicting source data
If imported data conflicts with existing rules:
- explain the conflict
- show both versions
- allow one to win or defer
- never overwrite silently

---

# 10. Onboarding Sequence Recommendation

Recommended order during initial setup:
1. Create household and child basics
2. Agreement import or manual custody setup
3. Confirm base schedule and handoff rules
4. School calendar import
5. Review school-day implications
6. Optional activity/event import
7. Land in Today + Handoff dashboard

This sequence keeps the user anchored in the child and core schedule first.

---

# 11. AI Setup-Specific Screens Inventory

Recommended dedicated screens:
1. AI setup intro
2. Agreement upload
3. Agreement processing
4. Agreement extraction overview
5. Rule review list
6. Rule detail / edit screen
7. Ambiguity resolution screen
8. Schedule confirmation screen
9. School calendar upload
10. School event review
11. School implication review
12. Import confirmation
13. Activity import review
14. Extraction failure / recovery screen

---

# 12. Important UX Microcopy Guidance

The product voice should remain:
- calm
- neutral
- operational
- child-first
- non-legalistic by default

Preferred phrases:
- "Review before applying"
- "Needs confirmation"
- "Suggested schedule rule"
- "Possible school-day assignment"
- "We found these events"

Avoid:
- "AI decided"
- "Legally correct"
- "Guaranteed"
- "Conflict score"
- "Fault"

---

# 13. MVP vs Later UX Scope

## MVP UX Scope
Include:
- agreement upload and review
- school calendar import and review
- editable extracted rules/events
- ambiguity resolution for core schedule issues
- manual fallback
- schedule preview before activation

## Later UX Scope
Add later:
- side-by-side legal clause and structured rule mapping
- advanced comparison views across versions
- bulk conflict resolution workspace
- multi-school imports for multiple children
- guided assistant mode for ongoing schedule maintenance

---

# 14. Suggested Next Documentation Step

After this UX flow spec, create:
1. a **data model extension** for AI-assisted extraction, review states, source documents, and applied rules
2. a **screen-by-screen wireframe spec** for the AI setup flow
3. an **implementation plan** for ingestion, extraction, review, and schedule generation services
