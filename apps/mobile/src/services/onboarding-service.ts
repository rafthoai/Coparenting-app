export interface OnboardingState {
  userId?: string;
  email: string;
  fullName: string;
  householdId?: string;
  householdName: string;
  childId?: string;
  childName: string;
  inviteId?: string;
  inviteeEmail: string;
}

export function createInitialOnboardingState(): OnboardingState {
  return {
    email: '',
    fullName: '',
    householdName: '',
    childName: '',
    inviteeEmail: ''
  };
}

export async function bootstrapUser(state: OnboardingState): Promise<OnboardingState> {
  return {
    ...state,
    userId: state.userId ?? `user-${crypto.randomUUID()}`
  };
}

export async function createHousehold(state: OnboardingState): Promise<OnboardingState> {
  return {
    ...state,
    householdId: state.householdId ?? `household-${crypto.randomUUID()}`
  };
}

export async function createChild(state: OnboardingState): Promise<OnboardingState> {
  return {
    ...state,
    childId: state.childId ?? `child-${crypto.randomUUID()}`
  };
}

export async function createInvite(state: OnboardingState): Promise<OnboardingState> {
  if (!state.inviteeEmail.trim()) {
    return state;
  }

  return {
    ...state,
    inviteId: state.inviteId ?? `invite-${crypto.randomUUID()}`
  };
}
