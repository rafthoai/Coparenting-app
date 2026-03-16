import { ScheduleSegment } from './types';

export interface HandoffEvent {
  childId: string;
  fromCaregiverMemberId: string;
  toCaregiverMemberId: string;
  occursAt: Date;
  sourceSegmentBeforeRuleId: string;
  sourceSegmentAfterRuleId: string;
}

export function generateHandoffs(segments: ScheduleSegment[]): HandoffEvent[] {
  const sorted = [...segments].sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());
  const handoffs: HandoffEvent[] = [];

  for (let i = 1; i < sorted.length; i += 1) {
    const previous = sorted[i - 1];
    const current = sorted[i];

    if (previous.childId !== current.childId) continue;
    if (previous.caregiverMemberId === current.caregiverMemberId) continue;
    if (previous.endsAt.getTime() !== current.startsAt.getTime()) continue;

    handoffs.push({
      childId: current.childId,
      fromCaregiverMemberId: previous.caregiverMemberId,
      toCaregiverMemberId: current.caregiverMemberId,
      occursAt: current.startsAt,
      sourceSegmentBeforeRuleId: previous.sourceRuleId,
      sourceSegmentAfterRuleId: current.sourceRuleId
    });
  }

  return handoffs;
}
