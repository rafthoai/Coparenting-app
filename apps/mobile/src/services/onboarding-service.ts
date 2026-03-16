import {
  bootstrapAndPersistAuthUser,
  createAndPersistChild,
  createAndPersistCoParentInvite,
  createAndPersistHousehold
} from '@coparenting/api';

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
  const user = await bootstrapAndPersistAuthUser({
    email: state.email,
    fullName: state.fullName
  });

  return {
    ...state,
    userId: user.id
  };
}

export async function createHousehold(state: OnboardingState): Promise<OnboardingState> {
  if (!state.userId) {
    throw new Error('Cannot create household before user bootstrap');
  }

  const household = await createAndPersistHousehold({
    ownerUserId: state.userId,
    householdName: state.householdName
  });

  return {
    ...state,
    householdId: household.id
  };
}

export async function createChild(state: OnboardingState): Promise<OnboardingState> {
  if (!state.householdId) {
    throw new Error('Cannot create child before household exists');
  }

  const child = await createAndPersistChild({
    householdId: state.householdId,
    name: state.childName
  });

  return {
    ...state,
    childId: child.id
  };
}

export async function createInvite(state: OnboardingState): Promise<OnboardingState> {
  if (!state.inviteeEmail.trim()) {
    return state;
  }

  if (!state.householdId || !state.userId) {
    throw new Error('Cannot create invite before household and user exist');
  }

  const invite = await createAndPersistCoParentInvite({
    householdId: state.householdId,
    invitedByUserId: state.userId,
    inviteeEmail: state.inviteeEmail
  });

  return {
    ...state,
    inviteId: invite.id
  };
}
