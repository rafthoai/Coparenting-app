# Co-Parenting App AI Feature Blueprint v1

## Purpose

This document defines the AI layer for the co-parenting app MVP and near-term roadmap. The goal is not to make AI the product centerpiece, but to use AI as a practical operations layer that reduces setup friction, transforms messy communication into structured workflows, and helps families maintain a reliable child-centered schedule.

## Product Thesis for AI

AI should help the app become the operating system for a child’s day across two homes by doing three things well:

1. Extract structure from messy real-world inputs
2. Summarize and clarify family operations
3. Assist users in taking calm, auditable action

AI should not initially act as a legal advisor, mediator, therapist, or judge.

## AI Design Principles

- Use AI to reduce friction, not create novelty for its own sake.
- Keep humans in control of any high-consequence schedule or agreement interpretation.
- Prefer review-and-confirm flows over silent automation for critical actions.
- Treat structured workflows as the source of truth; AI should feed them, not replace them.
- Use deterministic rules to enforce confirmed schedules and business logic.
- Position AI as calm, practical assistance rather than emotional or legal authority.

---

# AI Capability Map

## AI Capability 1: Agreement Import and Schedule Extraction

### User Problem
Setting up a co-parenting schedule from an MSA, parenting plan, or custody agreement is high-friction and error-prone.

### Feature Goal
Allow a parent to upload an agreement and extract candidate scheduling rules that can be reviewed and converted into structured custody setup.

### Inputs
- PDF agreement
- DOCX agreement
- Image or scan of agreement pages
- Plain text pasted from legal documents

### What AI Extracts
- Parent names and child references
- Recurring custody schedule patterns
- Alternating weekends or similar rotation rules
- Holiday allocation rules
- School break rules
- Teacher planning day handling if explicitly described
- Pickup/dropoff times
- Exchange locations when present
- Special exceptions or carve-outs

### Output
A **reviewable schedule setup draft**, not an automatically enforced legal interpretation.

### UX Flow
1. User uploads agreement
2. System parses text and identifies candidate rules
3. AI produces structured sections:
   - Weekly custody pattern
   - Holiday overrides
   - School break rules
   - Exchange timing rules
   - Ambiguities / missing details
4. User reviews extracted rules in editable UI
5. User confirms or edits each rule
6. Rules engine generates the household custody setup

### Important UX Language
Use language like:
- "We found these possible schedule rules"
- "Please review before applying"
- "Some terms appear ambiguous"
- "Confirm or edit these extracted custody rules"

Avoid language like:
- "We interpreted your legal agreement definitively"
- "This is legally correct"
- "This schedule is guaranteed to match the agreement"

### Risks
- Legal ambiguity
- Low-quality OCR
- Contradictory clauses
- User over-trust in AI output

### Controls
- Mandatory review screen
- Confidence or uncertainty indicators
- "Needs confirmation" state for ambiguous rules
- Clause/source linking where possible
- Editable extracted fields before save

---

## AI Capability 2: School Calendar Import

### User Problem
School calendars contain holidays, no-school days, planning days, and schedule exceptions that materially affect co-parenting logistics.

### Feature Goal
Allow users to upload or link a school calendar and automatically generate a school-year event layer for review.

### Inputs
- School calendar PDF
- Image or screenshot of school calendar
- School URL/webpage
- ICS or calendar file if available
- Email/newsletter text when relevant

### What AI Extracts
- First day / last day of school
- Holidays
- No-school days
- Teacher planning days
- Half days / early dismissals
- Break periods
- Special school events if included and useful

### Output
A **reviewable school calendar layer** mapped into the product calendar.

### Advanced Value
If the parenting agreement defines who is responsible for certain school-day exceptions, the app should combine:
- confirmed agreement rules
- extracted school-year dates

to generate likely custody implications for review.

### UX Flow
1. User uploads school calendar source
2. System extracts candidate dates and event types
3. User reviews grouped event sets
4. App highlights events with likely custody implications
5. User confirms import
6. Rules engine applies confirmed scheduling logic

### Risks
- Date extraction mistakes
- Ambiguous labels on school calendars
- Different formats across schools
- Over-automation in legally sensitive edge cases

### Controls
- Preview before import
- Batch edit support
- Source-aware extraction notes
- Flag dates requiring manual confirmation
- Keep imported school events distinguishable from user-created events

---

## AI Capability 3: Activity and Event Ingestion

### User Problem
Extracurricular schedules are scattered across emails, flyers, screenshots, PDFs, team portals, and text messages.

### Feature Goal
Allow users to turn messy school and activity materials into structured calendar events quickly.

### Inputs
- Flyer images
- PDFs
- screenshots
- emails
- copied text
- team schedule links if parsable

### What AI Extracts
- Event name
- Date and time
- Recurrence pattern if any
- Location
- Child association
- Optional notes or equipment reminders
- Whether approval or notification may be needed

### Output
A **reviewable event draft** or recurring event set.

### UX Flow
1. User uploads or forwards activity source
2. AI extracts candidate event data
3. User confirms child, time, recurrence, and location
4. Event is added to the family calendar
5. Optional prompt: notify co-parent or create approval request

### Risks
- Incorrect recurrence extraction
- Wrong time zone or time parsing
- Wrong child association

### Controls
- Always show editable event preview
- Keep source attachment linked to event
- Default to draft state before calendar insertion when confidence is low

---

## AI Capability 4: Message-to-Action Extraction

### User Problem
Important decisions get buried in chat threads and never become structured actions.

### Feature Goal
Detect when a message or thread likely represents a swap, consent request, expense, or event and suggest conversion into a structured object.

### Inputs
- Message text
- Thread context
- Child context
- Calendar context

### What AI Detects
- Swap requests
- Consent requests
- Expense mentions
- Event creation opportunities
- Missing specifics that should be clarified

### Output
A **suggested structured action draft**.

### UX Flow
1. Parent sends or views message
2. AI suggests "Create swap request" or similar
3. Draft is prefilled with extracted details
4. User edits/approves
5. Request/event/expense object is created

### Why It Matters
This directly supports the core product thesis that communication should become structured action.

---

## AI Capability 5: Thread Summaries and Family Digests

### User Problem
Long threads and many moving parts increase conflict, confusion, and mental load.

### Feature Goal
Provide operational summaries that help parents quickly understand what matters now.

### Summary Types
- Thread summary
- Daily digest
- Weekly digest
- Child-specific snapshot

### Useful Outputs
- Confirmed decisions
- Unresolved items
- Pending approvals
- Upcoming handoffs
- Expense items awaiting action
- Recent meaningful updates

### Guidance
Prefer operational summaries over conversational paraphrasing.

Good summary:
- 1 swap request pending for Friday
- 2 expenses awaiting reimbursement
- next handoff Sunday at 5:00 PM
- school permission for field trip unresolved

---

## AI Capability 6: Neutral Rewrite Assistance

### User Problem
Co-parent communication often escalates because of tone, ambiguity, or incomplete logistical details.

### Feature Goal
Provide optional drafting assistance that makes messages calmer, clearer, and more action-oriented.

### Suggested Modes
- Make this clearer
- Make this more neutral
- Shorten this
- Add missing operational details

### Guidance
This feature should remain assistive and optional. It should never shame users or imply moral judgment.

---

## AI Capability 7: Smart Search and Family Memory

### User Problem
Parents often need to find prior agreements, expenses, or scheduling decisions buried across records.

### Feature Goal
Allow users to retrieve structured answers from family data.

### Example Queries
- "When did we last discuss spring break pickup?"
- "Show approved expenses for Ava in February"
- "Did we already agree to switch soccer this week?"

### Architecture Note
This should be built on retrieval over structured and conversational data, not free-form hallucination.

---

# AI Roadmap

## AI V1 (highest-value, lower-risk)

Ship these first:
1. Message-to-action extraction
2. Thread summaries
3. Daily or weekly family digest
4. Neutral rewrite assistance

These features are useful, practical, and lower-risk than legal or schedule interpretation.

## AI V1.5

Ship next:
5. Activity and event ingestion
6. Smart search and family memory

## AI V2

Ship after core scheduling and structured data systems are stable:
7. Agreement import and schedule extraction
8. School calendar import with custody implication mapping

These are high-value and potentially differentiating, but they require careful UX, review logic, and deterministic rules integration.

## AI V2.5 or later

Possible later features:
- predictive schedule conflict alerts
- reimbursement bottleneck detection
- recurring unresolved issue detection
- memory/timeline curation
- more advanced operational assistant experiences

---

# Architecture Approach for AI

## Layer 1: Ingestion
Ingest files and content from:
- PDF
- DOCX
- image
- screenshot
- email text
- webpage
- calendar files

## Layer 2: Extraction
Use AI plus deterministic parsing to extract:
- dates
- entities
- rules
- event candidates
- request candidates
- ambiguities

## Layer 3: Review
For any high-consequence output, require user review before applying changes.

## Layer 4: Structured Object Creation
Create confirmed product objects such as:
- custody rules
- events
- requests
- expenses
- notifications

## Layer 5: Rules Engine Enforcement
Use deterministic logic for:
- recurring schedule generation
- holiday/year rotation handling
- request status transitions
- permission checks
- conflict detection
- notification triggers

## Principle
AI should **read and propose**.
Rules engine should **enforce and apply**.

---

# Data and Safety Considerations

## Sensitive Data Categories
The AI layer may process:
- child information
- family schedules
- legal agreements
- private messages
- receipts and financial records
- photos and attachments

## Safety Requirements
- Encrypt data in transit and at rest where supported
- Restrict document access by household membership
- Use signed URLs for file access
- Log generation of exports and sensitive AI actions
- Avoid exposing sensitive message content in notifications
- Make AI-generated outputs traceable to their source where possible

## Trust Controls
- Show confidence or ambiguity where feasible
- Provide source excerpts for extracted rules/events when possible
- Make high-impact AI actions reviewable and editable
- Preserve audit history for confirmed changes

---

# What AI Should Not Do Early

Do not ship these as early core features:
- legal advice
- custody interpretation claims of certainty
- fairness scoring between parents
- tone policing or moral scoring
- mediation or therapy-style bots
- automatic enforcement of ambiguous legal clauses without review
- courtroom or compliance branding as the main AI promise

---

# Positioning Recommendation

Present the AI layer as:

## "AI-assisted family setup and coordination"

Good promise areas:
- Upload your agreement and review a suggested schedule setup
- Import a school calendar and generate important days automatically
- Turn messy messages into clear requests and events
- See the week’s decisions and open items at a glance

Avoid presenting the app as:
- an AI legal interpreter
- a custody decision-maker
- a conflict judge

---

# Monetization Implications

## Possible premium AI package
Potential premium AI features could include:
- thread summaries
- weekly family digests
- smart search
- agreement import
- school calendar import
- event extraction from emails and flyers
- neutral rewrite assistance

This is stronger than charging for generic chat because the value is tied to practical family operations.

---

# Recommended Next Documentation Step

Use this document together with:
- the MVP blueprint
- the app architecture blueprint

Then create:
1. a **rules engine specification** for custody logic, holiday overrides, and schedule generation
2. a **data model update** covering AI-generated drafts, confidence flags, and source links
3. a **UX flow spec** for agreement import, school calendar import, and review screens
