export type RequestType =
  | 'swap_request'
  | 'consent_request'
  | 'signoff_request'
  | 'expense_preapproval';

export type RequestStatus =
  | 'draft'
  | 'pending'
  | 'countered'
  | 'approved'
  | 'declined'
  | 'cancelled'
  | 'completed';

export interface RequestRecord {
  id: string;
  householdId: string;
  childId: string;
  type: RequestType;
  status: RequestStatus;
  createdByUserId: string;
  assignedToUserId?: string;
  payload: Record<string, unknown>;
}

export interface StatusChange {
  fromStatus: RequestStatus;
  toStatus: RequestStatus;
  reason?: string;
}

const allowedTransitions: Record<RequestStatus, RequestStatus[]> = {
  draft: ['pending', 'cancelled'],
  pending: ['countered', 'approved', 'declined', 'cancelled'],
  countered: ['pending', 'approved', 'declined', 'cancelled'],
  approved: ['completed'],
  declined: [],
  cancelled: [],
  completed: []
};

export function canTransition(fromStatus: RequestStatus, toStatus: RequestStatus): boolean {
  return allowedTransitions[fromStatus].includes(toStatus);
}

export function transitionRequest(
  request: RequestRecord,
  toStatus: RequestStatus,
  reason?: string
): { request: RequestRecord; history: StatusChange } {
  if (!canTransition(request.status, toStatus)) {
    throw new Error(`Invalid request transition: ${request.status} -> ${toStatus}`);
  }

  const history: StatusChange = {
    fromStatus: request.status,
    toStatus,
    reason
  };

  return {
    request: {
      ...request,
      status: toStatus
    },
    history
  };
}

export interface SwapPayload {
  currentStartsAt: string;
  currentEndsAt: string;
  proposedStartsAt: string;
  proposedEndsAt: string;
  isPartialDay?: boolean;
  exchangeLocation?: string;
}

export interface GeneratedExceptionRuleDraft {
  householdId: string;
  childId: string;
  caregiverMemberId: string;
  startsAt: string;
  endsAt: string;
  sourceType: 'approved_swap';
  linkedRequestId: string;
  reason: string;
}

export function createSwapExceptionRuleDraft(input: {
  request: RequestRecord;
  approvingCaregiverMemberId: string;
}): GeneratedExceptionRuleDraft {
  if (input.request.type !== 'swap_request') {
    throw new Error('Swap exception drafts can only be created from swap requests');
  }

  if (input.request.status !== 'approved') {
    throw new Error('Swap exception drafts can only be created after approval');
  }

  const payload = input.request.payload as unknown as SwapPayload;

  return {
    householdId: input.request.householdId,
    childId: input.request.childId,
    caregiverMemberId: input.approvingCaregiverMemberId,
    startsAt: payload.proposedStartsAt,
    endsAt: payload.proposedEndsAt,
    sourceType: 'approved_swap',
    linkedRequestId: input.request.id,
    reason: 'Generated from approved swap request'
  };
}
