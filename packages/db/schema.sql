-- Co-Parenting App initial PostgreSQL schema
-- Focus: foundation entities + schedule/rules engine core

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Core enums
-- ---------------------------------------------------------------------------

create type household_member_role as enum (
  'owner',
  'parent',
  'invited_parent'
);

create type household_member_status as enum (
  'invited',
  'active',
  'inactive'
);

create type invite_status as enum (
  'pending',
  'accepted',
  'expired',
  'cancelled'
);

create type child_status as enum (
  'active',
  'archived'
);

create type rule_status as enum (
  'draft',
  'proposed',
  'confirmed',
  'active',
  'blocked',
  'superseded',
  'archived'
);

create type recurring_rule_type as enum (
  'weekly_day_assignment',
  'alternating_weekend',
  'alternating_week',
  'rotating_pattern'
);

create type holiday_assignment_strategy as enum (
  'fixed_caregiver',
  'alternate_by_year_parity',
  'alternate_by_sequence',
  'split_interval',
  'inherit_base_schedule'
);

create type school_event_type as enum (
  'spring_break',
  'winter_break',
  'teacher_planning_day',
  'no_school_day',
  'early_release_day',
  'summer_break_segment',
  'school_closure'
);

create type school_assignment_strategy as enum (
  'fixed_caregiver',
  'follow_base_schedule_owner',
  'alternate_by_year_parity',
  'alternate_by_event_occurrence',
  'attach_to_adjacent_weekend_owner',
  'manual_confirmation_required'
);

create type exception_source_type as enum (
  'approved_swap',
  'approved_manual_exception',
  'event_specific_override'
);

create type handoff_trigger_type as enum (
  'segment_boundary',
  'holiday_override',
  'school_break_override',
  'approved_swap',
  'manual_override'
);

create type calendar_event_type as enum (
  'custody_block',
  'handoff',
  'school_event',
  'activity_event',
  'custom_event'
);

create type schedule_segment_source_layer as enum (
  'base_custody_pattern',
  'holiday_overrides',
  'school_break_overrides',
  'approved_swaps_and_exceptions',
  'manual_admin_overrides'
);

create type rule_conflict_status as enum (
  'open',
  'resolved',
  'ignored',
  'superseded'
);

create type rule_conflict_severity as enum (
  'blocker',
  'warning',
  'info'
);

create type rule_conflict_type as enum (
  'overlapping_rules',
  'contradictory_holiday_assignment',
  'missing_anchor_date',
  'school_rule_gap',
  'incompatible_time_window',
  'duplicate_exception'
);

-- ---------------------------------------------------------------------------
-- Foundation tables
-- ---------------------------------------------------------------------------

create table app_user (
  id uuid primary key default gen_random_uuid(),
  external_auth_id text unique,
  email text unique not null,
  full_name text not null,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table household (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_by_user_id uuid not null references app_user(id),
  primary_timezone text not null default 'America/New_York',
  invite_policy jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table household_member (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references household(id) on delete cascade,
  user_id uuid not null references app_user(id) on delete cascade,
  role household_member_role not null,
  status household_member_status not null default 'invited',
  permissions_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (household_id, user_id)
);

create table household_invite (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references household(id) on delete cascade,
  invited_by_user_id uuid not null references app_user(id),
  invitee_email text not null,
  role household_member_role not null default 'invited_parent',
  token text not null unique,
  status invite_status not null default 'pending',
  expires_at timestamptz,
  accepted_at timestamptz,
  created_at timestamptz not null default now()
);

create table child (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references household(id) on delete cascade,
  name text not null,
  birthdate date,
  avatar_url text,
  notes text,
  status child_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table custody_template (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references household(id) on delete cascade,
  name text not null,
  template_type text not null,
  config_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Rules engine tables
-- ---------------------------------------------------------------------------

create table recurring_custody_rule (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references household(id) on delete cascade,
  child_id uuid not null references child(id) on delete cascade,
  caregiver_member_id uuid not null references household_member(id),
  rule_type recurring_rule_type not null,
  recurrence_pattern jsonb not null,
  anchor_date date,
  starts_at timestamptz not null,
  ends_at timestamptz,
  handoff_time_start time,
  handoff_time_end time,
  priority integer not null default 100,
  status rule_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table holiday_override_rule (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references household(id) on delete cascade,
  child_id uuid not null references child(id) on delete cascade,
  holiday_type text not null,
  assignment_strategy holiday_assignment_strategy not null,
  caregiver_member_id uuid references household_member(id),
  odd_year_caregiver_member_id uuid references household_member(id),
  even_year_caregiver_member_id uuid references household_member(id),
  time_window_definition jsonb not null,
  split_definition jsonb,
  priority integer not null default 200,
  status rule_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table school_break_rule (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references household(id) on delete cascade,
  child_id uuid not null references child(id) on delete cascade,
  school_event_type school_event_type not null,
  assignment_strategy school_assignment_strategy not null,
  caregiver_member_id uuid references household_member(id),
  odd_year_caregiver_member_id uuid references household_member(id),
  even_year_caregiver_member_id uuid references household_member(id),
  conditions_json jsonb not null default '{}'::jsonb,
  priority integer not null default 300,
  status rule_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table exception_rule (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references household(id) on delete cascade,
  child_id uuid not null references child(id) on delete cascade,
  source_type exception_source_type not null,
  linked_request_id uuid,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  caregiver_member_id uuid not null references household_member(id),
  reason text,
  status rule_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create table handoff_rule (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references household(id) on delete cascade,
  child_id uuid not null references child(id) on delete cascade,
  trigger_type handoff_trigger_type not null,
  handoff_time time not null,
  handoff_location text,
  notes text,
  status rule_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Schedule and calendar output tables
-- ---------------------------------------------------------------------------

create table calendar_event (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references household(id) on delete cascade,
  child_id uuid references child(id) on delete cascade,
  type calendar_event_type not null,
  title text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  created_by_user_id uuid references app_user(id),
  source text not null default 'manual',
  metadata_json jsonb not null default '{}'::jsonb,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create table schedule_segment (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references household(id) on delete cascade,
  child_id uuid not null references child(id) on delete cascade,
  caregiver_member_id uuid not null references household_member(id),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  source_layer schedule_segment_source_layer not null,
  source_rule_id uuid not null,
  source_object_id uuid,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create table handoff_event (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references child(id) on delete cascade,
  from_caregiver_member_id uuid references household_member(id),
  to_caregiver_member_id uuid references household_member(id),
  occurs_at timestamptz not null,
  location text,
  source_segment_before_id uuid references schedule_segment(id),
  source_segment_after_id uuid references schedule_segment(id),
  created_at timestamptz not null default now()
);

create table derived_responsibility_day (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references child(id) on delete cascade,
  schedule_date date not null,
  primary_caregiver_member_id uuid references household_member(id),
  is_school_day boolean not null default false,
  is_holiday boolean not null default false,
  is_no_school_day boolean not null default false,
  source_resolution_summary text,
  created_at timestamptz not null default now(),
  unique (child_id, schedule_date)
);

-- ---------------------------------------------------------------------------
-- Rule conflicts and explainability helpers
-- ---------------------------------------------------------------------------

create table rule_conflict (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references household(id) on delete cascade,
  child_id uuid references child(id) on delete cascade,
  conflict_type rule_conflict_type not null,
  status rule_conflict_status not null default 'open',
  severity rule_conflict_severity not null default 'warning',
  description text not null,
  linked_rule_ids jsonb not null default '[]'::jsonb,
  resolution_notes text,
  resolved_by_user_id uuid references app_user(id),
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

create table rule_audit_log (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references household(id) on delete cascade,
  rule_type text not null,
  rule_id uuid not null,
  action text not null,
  performed_by_user_id uuid references app_user(id),
  from_state text,
  to_state text,
  metadata_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table schedule_segment_source (
  id uuid primary key default gen_random_uuid(),
  schedule_segment_id uuid not null references schedule_segment(id) on delete cascade,
  rule_id uuid not null,
  rule_type text not null,
  precedence_layer schedule_segment_source_layer not null,
  overrode_rule_id uuid,
  created_at timestamptz not null default now()
);

create table handoff_event_source (
  id uuid primary key default gen_random_uuid(),
  handoff_event_id uuid not null references handoff_event(id) on delete cascade,
  source_rule_id uuid not null,
  source_rule_type text not null,
  source_schedule_segment_before_id uuid references schedule_segment(id),
  source_schedule_segment_after_id uuid references schedule_segment(id),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

create index idx_household_member_household on household_member(household_id);
create index idx_household_member_user on household_member(user_id);
create index idx_child_household on child(household_id);

create index idx_recurring_rule_household_child on recurring_custody_rule(household_id, child_id);
create index idx_holiday_rule_household_child on holiday_override_rule(household_id, child_id);
create index idx_school_break_rule_household_child on school_break_rule(household_id, child_id);
create index idx_exception_rule_household_child on exception_rule(household_id, child_id);

create index idx_calendar_event_household_child_time on calendar_event(household_id, child_id, starts_at, ends_at);
create index idx_schedule_segment_child_time on schedule_segment(child_id, starts_at, ends_at);
create index idx_handoff_event_child_occurs_at on handoff_event(child_id, occurs_at);
create index idx_derived_responsibility_day_child_date on derived_responsibility_day(child_id, schedule_date);

create index idx_rule_conflict_household_child on rule_conflict(household_id, child_id);
create index idx_rule_audit_log_household_rule on rule_audit_log(household_id, rule_type, rule_id);

-- ---------------------------------------------------------------------------
-- Notes
-- ---------------------------------------------------------------------------
-- Next schema wave should add:
-- - request engine tables
-- - messaging + attachments
-- - expenses
-- - timeline
-- - notifications
-- - AI ingestion / extraction tables
-- - export jobs
