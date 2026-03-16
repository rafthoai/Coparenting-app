# Co-Parenting App AI Data Model Extension v1

## Purpose

This document extends the core app data model to support AI-assisted extraction, document ingestion, review states, confidence signaling, source traceability, and the connection between uploaded materials and generated schedule/rule objects.

It is intended to sit on top of the base product architecture, AI feature blueprint, and rules engine specification.

## Design Goals

The extended data model should allow the system to:
- ingest source documents and external schedule materials
- store extraction jobs and outputs safely
- track review and confirmation state
- preserve source-to-rule traceability
- keep proposed AI outputs separate from active app logic
- support explainability and auditability
- enable partial extraction and partial confirmation flows

## Core Principle

AI-generated output should not become active system logic automatically.

The model should clearly separate:
- source input
- extraction output
- reviewed draft
- confirmed rule/event
- active generated schedule effects

---

# 1. High-Level Model Layers

The AI data model should be organized into five logical layers.

## Layer 1: Source Assets
Raw user-provided materials.
Examples:
- agreement PDFs
- school calendar files
- event flyers
- screenshots
- emails or imported text

## Layer 2: Extraction Jobs and Outputs
System processing runs and AI-assisted outputs.
Examples:
- OCR text extraction
- detected rule candidates
- detected event candidates
- ambiguity markers

## Layer 3: Reviewable Draft Objects
User-editable draft interpretations of extracted content.
Examples:
- draft custody rule
- draft holiday override
- draft school-day event set
- draft extracurricular event

## Layer 4: Confirmed Domain Objects
Real product objects that can affect schedule generation and app behavior.
Examples:
- recurring custody rule
- school break rule
- calendar event
- exception rule

## Layer 5: Generated Effects
Outputs created by rules engine or downstream logic.
Examples:
- generated schedule segments
- handoff events
- notifications
- activity log entries

---

# 2. Source Asset Model

## 2.1 SourceDocument
Represents an uploaded or linked input that may be processed by AI.

Fields:
- `source_document_id`
- `household_id`
- `child_id` nullable
- `uploaded_by_user_id`
- `document_type`
- `file_name`
- `mime_type`
- `storage_key`
- `file_size_bytes`
- `source_channel`
- `status`
- `created_at`
- `processed_at` nullable
- `archived_at` nullable

Recommended `document_type` values:
- agreement
- school_calendar
- event_flyer
- email_text_export
- screenshot
- scanned_document
- miscellaneous

Recommended `source_channel` values:
- direct_upload
- pasted_text
- email_import
- url_fetch
- calendar_import

Recommended `status` values:
- uploaded
- processing
- processed
- partially_processed
- failed
- archived

## 2.2 SourceDocumentText
Stores extracted text and text segments derived from the source document.

Fields:
- `source_document_text_id`
- `source_document_id`
- `text_type`
- `full_text`
- `language_code` nullable
- `ocr_quality_score` nullable
- `created_at`

Recommended `text_type` values:
- raw_ocr
- normalized_text
- extracted_body

## 2.3 SourceExcerpt
Stores traceable snippets that can be referenced in review and explainability UX.

Fields:
- `source_excerpt_id`
- `source_document_id`
- `source_document_text_id` nullable
- `page_number` nullable
- `position_start` nullable
- `position_end` nullable
- `excerpt_text`
- `created_at`

This is useful for showing users the clause or date text that led to a candidate rule or event.

---

# 3. Extraction Job Model

## 3.1 ExtractionJob
Represents a processing run on one source asset.

Fields:
- `extraction_job_id`
- `source_document_id`
- `household_id`
- `child_id` nullable
- `job_type`
- `processor_type`
- `status`
- `started_at`
- `completed_at` nullable
- `error_code` nullable
- `error_message` nullable
- `created_by_user_id` nullable

Recommended `job_type` values:
- agreement_extraction
- school_calendar_extraction
- event_extraction
- message_to_action_extraction
- summary_generation

Recommended `processor_type` values:
- ocr_only
- ai_extraction
- hybrid_extraction
- deterministic_parser

Recommended `status` values:
- queued
- running
- succeeded
- partially_succeeded
- failed
- cancelled

## 3.2 ExtractionArtifact
Represents a structured output produced by an extraction job.

Fields:
- `extraction_artifact_id`
- `extraction_job_id`
- `artifact_type`
- `payload_json`
- `confidence_label` nullable
- `confidence_score` nullable
- `review_status`
- `created_at`

Recommended `artifact_type` values:
- child_reference_candidate
- recurring_rule_candidate
- holiday_rule_candidate
- school_break_rule_candidate
- handoff_time_candidate
- event_candidate
- ambiguity_candidate
- expense_candidate
- request_candidate
- summary_candidate

Recommended `confidence_label` values:
- high
- medium
- low
- ambiguous

Recommended `review_status` values:
- detected
- needs_review
- confirmed
- edited
- skipped
- unresolved

---

# 4. AI Draft Object Model

These objects represent the user-reviewable draft layer between extraction and real app logic.

## 4.1 DraftRule
Represents a draft rule created from AI extraction or semi-manual setup.

Fields:
- `draft_rule_id`
- `household_id`
- `child_id`
- `rule_family`
- `draft_type`
- `source_document_id` nullable
- `source_excerpt_id` nullable
- `extraction_artifact_id` nullable
- `proposed_payload_json`
- `edited_payload_json` nullable
- `review_status`
- `reviewed_by_user_id` nullable
- `reviewed_at` nullable
- `created_at`

Recommended `rule_family` values:
- recurring_custody
- holiday_override
- school_break
- handoff
- exception

Recommended `draft_type` values:
- ai_extracted
- manually_seeded
- ai_plus_manual_edit

## 4.2 DraftEvent
Represents a reviewable event candidate.

Fields:
- `draft_event_id`
- `household_id`
- `child_id` nullable
- `event_family`
- `source_document_id` nullable
- `source_excerpt_id` nullable
- `extraction_artifact_id` nullable
- `proposed_payload_json`
- `edited_payload_json` nullable
- `review_status`
- `reviewed_by_user_id` nullable
- `reviewed_at` nullable
- `created_at`

Recommended `event_family` values:
- school_calendar_event
- extracurricular_event
- imported_holiday_event
- handoff_candidate

## 4.3 DraftResolution
Represents an ambiguity resolution task or user choice during review.

Fields:
- `draft_resolution_id`
- `household_id`
- `child_id` nullable
- `source_document_id` nullable
- `extraction_artifact_id` nullable
- `resolution_type`
- `question_text`
- `options_json` nullable
- `selected_option_json` nullable
- `status`
- `resolved_by_user_id` nullable
- `resolved_at` nullable
- `created_at`

Recommended `resolution_type` values:
- alternating_anchor_date
- caregiver_assignment_clarification
- holiday_conflict_resolution
- school_break_assignment_choice
- handoff_time_clarification
- recurrence_pattern_confirmation

Recommended `status` values:
- open
- answered
- deferred
- abandoned

---

# 5. Confirmed Domain Object Links

Once draft objects are confirmed, they should create or update real domain objects.

The model should preserve the link between the confirmed object and the AI-assisted draft that created it.

## 5.1 DomainObjectSourceLink
Generic lineage table connecting confirmed objects to their source.

Fields:
- `domain_object_source_link_id`
- `household_id`
- `domain_object_type`
- `domain_object_id`
- `source_document_id` nullable
- `source_excerpt_id` nullable
- `extraction_artifact_id` nullable
- `draft_object_type` nullable
- `draft_object_id` nullable
- `link_purpose`
- `created_at`

Recommended `domain_object_type` values:
- recurring_custody_rule
- holiday_override_rule
- school_break_rule
- exception_rule
- handoff_rule
- calendar_event
- request
- expense

Recommended `link_purpose` values:
- generated_from
- reviewed_from
- explained_by
- traceability

This linkage supports explainability and user trust.

---

# 6. Review State Model

Review state should be explicit and consistent across extracted rules, events, and ambiguity tasks.

Recommended states:
- `detected`
- `needs_review`
- `confirmed`
- `edited`
- `skipped`
- `unresolved`
- `applied`
- `superseded`

## State meanings
- `detected`: system found candidate information
- `needs_review`: should not be applied without user attention
- `confirmed`: accepted as-is
- `edited`: user modified before acceptance
- `skipped`: intentionally ignored
- `unresolved`: blocked due to ambiguity/conflict
- `applied`: confirmed and converted into active domain logic
- `superseded`: replaced by a newer reviewed object

---

# 7. Confidence and Uncertainty Model

Confidence should be stored for system logic and admin/debugging, but user-facing UX should use simplified labels.

## Suggested fields on extraction artifacts and drafts
- `confidence_score` nullable numeric
- `confidence_label`
- `ambiguity_flags_json`
- `requires_manual_review` boolean

## Recommended `confidence_label` values
- high
- medium
- low
- ambiguous

## Example ambiguity flags
- missing_anchor_date
- conflicting_clauses
- unclear_holiday_split
- invalid_date_range
- missing_caregiver_reference
- OCR_uncertain

---

# 8. Rule Activation and Application Model

A confirmed rule should not automatically become active if dependencies are unresolved.

## Suggested activation fields on confirmed rule objects
- `activation_status`
- `effective_from`
- `effective_to` nullable
- `applied_version`
- `last_generated_at` nullable

Recommended `activation_status` values:
- draft
- confirmed
- active
- blocked
- archived
- superseded

## Activation rule
A rule may move from `confirmed` to `active` only if:
- required ambiguity resolutions are complete
- required linked school events or holiday definitions exist when applicable
- no blocking conflicts exist

---

# 9. Generated Schedule Traceability

Generated schedule segments and handoff events should be traceable to both active rules and original source lineage.

## 9.1 ScheduleSegmentSource
Fields:
- `schedule_segment_source_id`
- `schedule_segment_id`
- `rule_id`
- `rule_type`
- `precedence_layer`
- `overrode_rule_id` nullable
- `source_document_id` nullable
- `source_excerpt_id` nullable
- `created_at`

## 9.2 HandoffEventSource
Fields:
- `handoff_event_source_id`
- `handoff_event_id`
- `source_rule_id`
- `source_rule_type`
- `source_schedule_segment_before_id`
- `source_schedule_segment_after_id`
- `created_at`

These tables make explainability possible.

---

# 10. Conflict and Exception Model

## 10.1 RuleConflict
Represents unresolved collisions in extracted, draft, or active rule logic.

Fields:
- `rule_conflict_id`
- `household_id`
- `child_id` nullable
- `conflict_type`
- `status`
- `severity`
- `description`
- `linked_rule_ids_json`
- `linked_draft_rule_ids_json` nullable
- `resolution_notes` nullable
- `resolved_by_user_id` nullable
- `resolved_at` nullable
- `created_at`

Recommended `conflict_type` values:
- overlapping_rules
- contradictory_holiday_assignment
- missing_anchor_date
- school_rule_gap
- incompatible_time_window
- duplicate_exception

Recommended `status` values:
- open
- resolved
- ignored
- superseded

Recommended `severity` values:
- blocker
- warning
- info

## 10.2 ReviewException
Represents processing or review anomalies that should appear in setup UX.

Fields:
- `review_exception_id`
- `household_id`
- `source_document_id`
- `exception_type`
- `status`
- `message`
- `created_at`

Examples:
- OCR quality too low
- encrypted PDF unsupported
- school date parse incomplete

---

# 11. Audit and Explainability Model

## 11.1 AIActionLog
Tracks AI-assisted actions that may need transparency or support review.

Fields:
- `ai_action_log_id`
- `household_id`
- `child_id` nullable
- `user_id` nullable
- `action_type`
- `source_document_id` nullable
- `target_object_type` nullable
- `target_object_id` nullable
- `result_status`
- `metadata_json`
- `created_at`

Recommended `action_type` values:
- document_processed
- draft_rule_created
- rule_confirmed
- event_imported
- ambiguity_flagged
- summary_generated
- rewrite_suggested
- request_draft_created

## 11.2 RuleAuditLog
Tracks lifecycle changes to rule objects.

Fields:
- `rule_audit_log_id`
- `household_id`
- `rule_type`
- `rule_id`
- `action`
- `performed_by_user_id` nullable
- `from_state` nullable
- `to_state` nullable
- `metadata_json`
- `created_at`

---

# 12. Suggested Relationships Overview

## Agreement import path
- `SourceDocument` → `SourceDocumentText` → `SourceExcerpt`
- `SourceDocument` → `ExtractionJob`
- `ExtractionJob` → `ExtractionArtifact`
- `ExtractionArtifact` → `DraftRule`
- `DraftRule` → confirmed rule object
- confirmed rule object → `DomainObjectSourceLink`
- confirmed rule object → rules engine → `ScheduleSegment`

## School calendar import path
- `SourceDocument` → `ExtractionJob`
- `ExtractionArtifact` → `DraftEvent`
- `DraftEvent` → `CalendarEvent`
- `CalendarEvent` + `SchoolBreakRule` → rules engine → schedule effects

## Activity import path
- `SourceDocument` → `ExtractionArtifact`
- `ExtractionArtifact` → `DraftEvent`
- `DraftEvent` → `CalendarEvent`

---

# 13. MVP vs Later Data Model Scope

## MVP
Include in MVP:
- source documents
- extraction jobs
- extraction artifacts
- draft rules
- draft events
- review states
- source links
- conflict objects
- rule activation state
- generated schedule traceability

## Later
Add later:
- extraction quality analytics
- advanced multi-version comparison tooling
- admin moderation tooling
- richer semantic search indexes
- reusable household templates across many imports
- clause-to-rule diff views

---

# 14. Recommended API Surfaces

The backend should eventually expose APIs for:
- upload source document
- start extraction job
- get extraction results overview
- list draft rules/events needing review
- confirm/edit/skip draft objects
- resolve ambiguity task
- activate confirmed rules
- regenerate schedule window
- fetch explainability for day/segment
- list conflicts and review exceptions

---

# 15. Recommended Next Documentation Step

After this data model extension, create:
1. a **screen-by-screen wireframe spec** for the AI-assisted setup flow
2. an **implementation plan** for ingestion, extraction orchestration, review APIs, and schedule regeneration
3. an **explainability spec** for showing users why a day belongs to a given parent
