export type UUID = string;

export type ScheduleLayer =
  | 'base-custody-pattern'
  | 'holiday-overrides'
  | 'school-break-overrides'
  | 'approved-swaps-and-exceptions'
  | 'manual-admin-overrides';

export type RecurringRuleType =
  | 'weekly_day_assignment'
  | 'alternating_weekend'
  | 'alternating_week'
  | 'rotating_pattern';

export interface TimeWindow {
  startsAt: Date;
  endsAt: Date;
}

export interface ScheduleSegment extends TimeWindow {
  childId: UUID;
  caregiverMemberId: UUID;
  sourceLayer: ScheduleLayer;
  sourceRuleId: UUID;
}

export interface RecurringCustodyRule {
  id: UUID;
  childId: UUID;
  caregiverMemberId: UUID;
  ruleType: RecurringRuleType;
  startsAt: Date;
  endsAt?: Date;
  priority?: number;
  recurrencePattern: {
    weekdays?: number[];
    weekendStartWeekIndex?: number;
    weekendStartHour?: number;
    weekendEndHour?: number;
    alternatingAnchorDate?: Date;
    alternatingWeekParity?: 'odd' | 'even';
    rotatingPatternDays?: number[];
    rotatingCaregiverMemberIds?: UUID[];
  };
}

export interface OverrideRule extends TimeWindow {
  id: UUID;
  childId: UUID;
  caregiverMemberId: UUID;
  priority?: number;
}

export interface GenerateScheduleInput {
  childId: UUID;
  window: TimeWindow;
  recurringRules: RecurringCustodyRule[];
  holidayOverrides?: OverrideRule[];
  schoolBreakOverrides?: OverrideRule[];
  exceptions?: OverrideRule[];
  manualOverrides?: OverrideRule[];
}
