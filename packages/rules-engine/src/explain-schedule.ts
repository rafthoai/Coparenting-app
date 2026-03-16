import { ScheduleSegment } from './types';

export interface ScheduleExplanationInput {
  segment: ScheduleSegment;
  previousSegment?: ScheduleSegment;
}

export function explainScheduleSegment(input: ScheduleExplanationInput): string {
  const { segment, previousSegment } = input;

  const base = `This segment belongs to caregiver ${segment.caregiverMemberId} from ${segment.startsAt.toISOString()} to ${segment.endsAt.toISOString()} because rule ${segment.sourceRuleId} won in the ${segment.sourceLayer} layer.`;

  if (!previousSegment) {
    return base;
  }

  if (previousSegment.caregiverMemberId !== segment.caregiverMemberId) {
    return `${base} It changes from caregiver ${previousSegment.caregiverMemberId} because the previous segment ended at ${previousSegment.endsAt.toISOString()}.`;
  }

  return base;
}
