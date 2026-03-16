import { OverrideRule, RecurringCustodyRule, TimeWindow } from './types';

export type ConflictSeverity = 'blocker' | 'warning' | 'info';
export type ConflictType =
  | 'overlapping-rules'
  | 'missing-anchor-date'
  | 'invalid-time-window'
  | 'child-mismatch'
  | 'empty-weekday-assignment';

export interface RuleConflict {
  type: ConflictType;
  severity: ConflictSeverity;
  ruleIds: string[];
  message: string;
}

function overlaps(a: TimeWindow, b: TimeWindow): boolean {
  return a.startsAt < b.endsAt && b.startsAt < a.endsAt;
}

function validateRecurringRule(rule: RecurringCustodyRule): RuleConflict[] {
  const conflicts: RuleConflict[] = [];

  if (rule.endsAt && rule.endsAt <= rule.startsAt) {
    conflicts.push({
      type: 'invalid-time-window',
      severity: 'blocker',
      ruleIds: [rule.id],
      message: `Recurring rule ${rule.id} has an invalid time window.`
    });
  }

  if (
    (rule.ruleType === 'alternating_weekend' ||
      rule.ruleType === 'alternating_week' ||
      rule.ruleType === 'rotating_pattern') &&
    !rule.recurrencePattern.alternatingAnchorDate
  ) {
    conflicts.push({
      type: 'missing-anchor-date',
      severity: 'blocker',
      ruleIds: [rule.id],
      message: `Rule ${rule.id} is missing an anchor date.`
    });
  }

  if (
    rule.ruleType === 'weekly_day_assignment' &&
    (!rule.recurrencePattern.weekdays || rule.recurrencePattern.weekdays.length === 0)
  ) {
    conflicts.push({
      type: 'empty-weekday-assignment',
      severity: 'warning',
      ruleIds: [rule.id],
      message: `Weekly day assignment rule ${rule.id} has no weekdays configured.`
    });
  }

  return conflicts;
}

function validateOverrideRule(rule: OverrideRule): RuleConflict[] {
  if (rule.endsAt <= rule.startsAt) {
    return [
      {
        type: 'invalid-time-window',
        severity: 'blocker',
        ruleIds: [rule.id],
        message: `Override rule ${rule.id} has an invalid time window.`
      }
    ];
  }

  return [];
}

function detectOverlaps<T extends { id: string; childId: string } & TimeWindow>(rules: T[]): RuleConflict[] {
  const conflicts: RuleConflict[] = [];

  for (let i = 0; i < rules.length; i += 1) {
    for (let j = i + 1; j < rules.length; j += 1) {
      const left = rules[i];
      const right = rules[j];

      if (left.childId !== right.childId) {
        conflicts.push({
          type: 'child-mismatch',
          severity: 'info',
          ruleIds: [left.id, right.id],
          message: `Rules ${left.id} and ${right.id} belong to different children and should not be compared together.`
        });
        continue;
      }

      if (overlaps(left, right)) {
        conflicts.push({
          type: 'overlapping-rules',
          severity: 'warning',
          ruleIds: [left.id, right.id],
          message: `Rules ${left.id} and ${right.id} overlap for child ${left.childId}.`
        });
      }
    }
  }

  return conflicts;
}

export function detectConflicts(input: {
  recurringRules: RecurringCustodyRule[];
  holidayOverrides?: OverrideRule[];
  schoolBreakOverrides?: OverrideRule[];
  exceptions?: OverrideRule[];
  manualOverrides?: OverrideRule[];
}): RuleConflict[] {
  const conflicts: RuleConflict[] = [];

  for (const rule of input.recurringRules) {
    conflicts.push(...validateRecurringRule(rule));
  }

  const overrideCollections = [
    ...(input.holidayOverrides ?? []),
    ...(input.schoolBreakOverrides ?? []),
    ...(input.exceptions ?? []),
    ...(input.manualOverrides ?? [])
  ];

  for (const rule of overrideCollections) {
    conflicts.push(...validateOverrideRule(rule));
  }

  conflicts.push(...detectOverlaps(overrideCollections));

  return conflicts;
}
