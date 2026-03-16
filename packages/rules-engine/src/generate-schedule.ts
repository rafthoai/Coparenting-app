import {
  GenerateScheduleInput,
  OverrideRule,
  RecurringCustodyRule,
  ScheduleLayer,
  ScheduleSegment,
  TimeWindow
} from './types';

const DAY_MS = 24 * 60 * 60 * 1000;

function startOfDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * DAY_MS);
}

function maxDate(a: Date, b: Date): Date {
  return a > b ? a : b;
}

function minDate(a: Date, b: Date): Date {
  return a < b ? a : b;
}

function overlaps(a: TimeWindow, b: TimeWindow): boolean {
  return a.startsAt < b.endsAt && b.startsAt < a.endsAt;
}

function intersect(a: TimeWindow, b: TimeWindow): TimeWindow | null {
  if (!overlaps(a, b)) return null;
  return {
    startsAt: maxDate(a.startsAt, b.startsAt),
    endsAt: minDate(a.endsAt, b.endsAt)
  };
}

function sortSegments(segments: ScheduleSegment[]): ScheduleSegment[] {
  return [...segments].sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());
}

function mergeContiguousSegments(segments: ScheduleSegment[]): ScheduleSegment[] {
  const sorted = sortSegments(segments);
  const merged: ScheduleSegment[] = [];

  for (const current of sorted) {
    const last = merged[merged.length - 1];
    if (
      last &&
      last.childId === current.childId &&
      last.caregiverMemberId === current.caregiverMemberId &&
      last.sourceLayer === current.sourceLayer &&
      last.sourceRuleId === current.sourceRuleId &&
      last.endsAt.getTime() === current.startsAt.getTime()
    ) {
      last.endsAt = current.endsAt;
      continue;
    }

    merged.push({ ...current });
  }

  return merged;
}

function applyOverrides(
  baseSegments: ScheduleSegment[],
  overrides: OverrideRule[],
  sourceLayer: ScheduleLayer
): ScheduleSegment[] {
  let segments = [...baseSegments];

  for (const override of overrides) {
    const nextSegments: ScheduleSegment[] = [];

    for (const segment of segments) {
      if (segment.childId !== override.childId || !overlaps(segment, override)) {
        nextSegments.push(segment);
        continue;
      }

      if (segment.startsAt < override.startsAt) {
        nextSegments.push({
          ...segment,
          endsAt: override.startsAt
        });
      }

      const overlapWindow = intersect(segment, override);
      if (overlapWindow) {
        nextSegments.push({
          childId: segment.childId,
          caregiverMemberId: override.caregiverMemberId,
          startsAt: overlapWindow.startsAt,
          endsAt: overlapWindow.endsAt,
          sourceLayer,
          sourceRuleId: override.id
        });
      }

      if (segment.endsAt > override.endsAt) {
        nextSegments.push({
          ...segment,
          startsAt: override.endsAt
        });
      }
    }

    segments = mergeContiguousSegments(nextSegments);
  }

  return segments;
}

function generateWeeklyDayAssignments(
  childId: string,
  window: TimeWindow,
  rules: RecurringCustodyRule[]
): ScheduleSegment[] {
  const segments: ScheduleSegment[] = [];
  const windowStartDay = startOfDay(window.startsAt);
  const windowEndDay = startOfDay(window.endsAt);

  for (let cursor = windowStartDay; cursor < windowEndDay; cursor = addDays(cursor, 1)) {
    const dayStart = maxDate(cursor, window.startsAt);
    const dayEnd = minDate(addDays(cursor, 1), window.endsAt);
    if (dayStart >= dayEnd) continue;

    const matching = rules.filter((rule) => {
      if (rule.ruleType !== 'weekly_day_assignment') return false;
      if (rule.startsAt > dayStart) return false;
      if (rule.endsAt && rule.endsAt <= dayStart) return false;
      return rule.recurrencePattern.weekdays?.includes(cursor.getUTCDay()) ?? false;
    });

    matching.sort((a, b) => (b.priority ?? 100) - (a.priority ?? 100));
    const winner = matching[0];
    if (!winner) continue;

    segments.push({
      childId,
      caregiverMemberId: winner.caregiverMemberId,
      startsAt: dayStart,
      endsAt: dayEnd,
      sourceLayer: 'base-custody-pattern',
      sourceRuleId: winner.id
    });
  }

  return mergeContiguousSegments(segments);
}

function generateAlternatingWeekends(
  childId: string,
  window: TimeWindow,
  rules: RecurringCustodyRule[]
): ScheduleSegment[] {
  const segments: ScheduleSegment[] = [];
  const weekendRules = rules.filter((rule) => rule.ruleType === 'alternating_weekend');

  for (const rule of weekendRules) {
    const anchor = rule.recurrencePattern.alternatingAnchorDate;
    if (!anchor) continue;

    const weekendStartHour = rule.recurrencePattern.weekendStartHour ?? 17;
    const weekendEndHour = rule.recurrencePattern.weekendEndHour ?? 18;

    for (let cursor = startOfDay(window.startsAt); cursor < window.endsAt; cursor = addDays(cursor, 1)) {
      if (cursor.getUTCDay() !== 5) continue; // Friday UTC day bucket

      const weeksSinceAnchor = Math.floor((startOfDay(cursor).getTime() - startOfDay(anchor).getTime()) / (7 * DAY_MS));
      const isOdd = Math.abs(weeksSinceAnchor) % 2 === 1;
      const expectsOdd = rule.recurrencePattern.alternatingWeekParity === 'odd';
      const matchesParity = expectsOdd ? isOdd : !isOdd;
      if (!matchesParity) continue;

      const weekendStart = new Date(Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth(), cursor.getUTCDate(), weekendStartHour));
      const weekendEndBase = addDays(cursor, 2);
      const weekendEnd = new Date(Date.UTC(weekendEndBase.getUTCFullYear(), weekendEndBase.getUTCMonth(), weekendEndBase.getUTCDate(), weekendEndHour));
      const overlapWindow = intersect({ startsAt: weekendStart, endsAt: weekendEnd }, window);
      if (!overlapWindow) continue;

      segments.push({
        childId,
        caregiverMemberId: rule.caregiverMemberId,
        startsAt: overlapWindow.startsAt,
        endsAt: overlapWindow.endsAt,
        sourceLayer: 'base-custody-pattern',
        sourceRuleId: rule.id
      });
    }
  }

  return mergeContiguousSegments(segments);
}

export function generateSchedule(input: GenerateScheduleInput): ScheduleSegment[] {
  const baseWeekly = generateWeeklyDayAssignments(input.childId, input.window, input.recurringRules);
  const alternatingWeekends = generateAlternatingWeekends(input.childId, input.window, input.recurringRules);

  let segments = mergeContiguousSegments([...baseWeekly, ...alternatingWeekends]);
  segments = applyOverrides(segments, input.holidayOverrides ?? [], 'holiday-overrides');
  segments = applyOverrides(segments, input.schoolBreakOverrides ?? [], 'school-break-overrides');
  segments = applyOverrides(segments, input.exceptions ?? [], 'approved-swaps-and-exceptions');
  segments = applyOverrides(segments, input.manualOverrides ?? [], 'manual-admin-overrides');

  return sortSegments(segments);
}
