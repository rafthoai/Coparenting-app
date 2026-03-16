-- Request engine schema extension
-- Focus: swaps, approvals, counters, consent/sign-off, and expense pre-approval

create type request_type as enum (
  'swap_request',
  'consent_request',
  'signoff_request',
  'expense_preapproval'
);

create type request_status as enum (
  'draft',
  'pending',
  'countered',
  'approved',
  'declined',
  'cancelled',
  'completed'
);

create type request_actor_role as enum (
  'creator',
  'assignee',
  'reviewer',
  'system'
);

create table request (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references household(id) on delete cascade,
  child_id uuid not null references child(id) on delete cascade,
  type request_type not null,
  status request_status not null default 'draft',
  created_by_user_id uuid not null references app_user(id),
  assigned_to_user_id uuid references app_user(id),
  related_calendar_event_id uuid references calendar_event(id),
  related_expense_id uuid,
  source_message_thread_id uuid,
  title text,
  reason text,
  payload_json jsonb not null default '{}'::jsonb,
  submitted_at timestamptz,
  resolved_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table request_status_history (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references request(id) on delete cascade,
  from_status request_status,
  to_status request_status not null,
  changed_by_user_id uuid references app_user(id),
  actor_role request_actor_role not null,
  note text,
  metadata_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table request_counterproposal (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references request(id) on delete cascade,
  proposed_by_user_id uuid not null references app_user(id),
  payload_json jsonb not null,
  note text,
  created_at timestamptz not null default now()
);

create table request_attachment (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references request(id) on delete cascade,
  attachment_storage_key text not null,
  file_name text not null,
  mime_type text not null,
  size_bytes bigint,
  uploaded_by_user_id uuid references app_user(id),
  created_at timestamptz not null default now()
);

create table swap_request_detail (
  request_id uuid primary key references request(id) on delete cascade,
  current_starts_at timestamptz not null,
  current_ends_at timestamptz not null,
  proposed_starts_at timestamptz not null,
  proposed_ends_at timestamptz not null,
  is_partial_day boolean not null default false,
  exchange_location text,
  check (current_ends_at > current_starts_at),
  check (proposed_ends_at > proposed_starts_at)
);

create table request_schedule_effect (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references request(id) on delete cascade,
  effect_type text not null,
  target_rule_id uuid,
  target_schedule_segment_id uuid references schedule_segment(id),
  generated_exception_rule_id uuid references exception_rule(id),
  metadata_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index idx_request_household_child on request(household_id, child_id);
create index idx_request_status on request(status);
create index idx_request_type on request(type);
create index idx_request_assigned_to on request(assigned_to_user_id);
create index idx_request_created_by on request(created_by_user_id);
create index idx_request_status_history_request on request_status_history(request_id, created_at);
create index idx_request_counterproposal_request on request_counterproposal(request_id, created_at);
create index idx_request_schedule_effect_request on request_schedule_effect(request_id);

-- Notes
-- 1. Approved swap requests should create exception_rule records, not mutate recurring rules.
-- 2. request.payload_json should carry per-type structured details for non-swap requests.
-- 3. request_schedule_effect exists to preserve traceability between approvals and schedule regeneration.
