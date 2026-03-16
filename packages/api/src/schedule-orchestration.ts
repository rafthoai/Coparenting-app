import { createSwapExceptionRuleDraft, RequestRecord } from './request-engine';
import { generateHandoffs } from '@coparenting/rules-engine/generate-handoffs';
import { generateSchedule } from '@coparenting/rules-engine/generate-schedule';
import { GenerateScheduleInput, OverrideRule, ScheduleSegment } from '@coparenting/rules-engine/types';

export interface ApprovedSwapOrchestrationInput {
  request: RequestRecord;
  approvingCaregiverMemberId: string;
  scheduleInput: GenerateScheduleInput;
}

export interface ApprovedSwapOrchestrationResult {
  generatedExceptionRule: OverrideRule;
  scheduleSegments: ScheduleSegment[];
  handoffs: ReturnType<typeof generateHandoffs>;
}

export function applyApprovedSwapAndRegenerate(
  input: ApprovedSwapOrchestrationInput
): ApprovedSwapOrchestrationResult {
  const exceptionDraft = createSwapExceptionRuleDraft({
    request: input.request,
    approvingCaregiverMemberId: input.approvingCaregiverMemberId
  });

  const generatedExceptionRule: OverrideRule = {
    id: `exception-${input.request.id}`,
    childId: exceptionDraft.childId,
    caregiverMemberId: exceptionDraft.caregiverMemberId,
    startsAt: new Date(exceptionDraft.startsAt),
    endsAt: new Date(exceptionDraft.endsAt),
    priority: 400
  };

  const scheduleSegments = generateSchedule({
    ...input.scheduleInput,
    exceptions: [...(input.scheduleInput.exceptions ?? []), generatedExceptionRule]
  });

  const handoffs = generateHandoffs(scheduleSegments);

  return {
    generatedExceptionRule,
    scheduleSegments,
    handoffs
  };
}
