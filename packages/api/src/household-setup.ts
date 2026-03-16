export interface CreateHouseholdInput {
  ownerUserId: string;
  householdName: string;
  timezone?: string;
}

export interface CreateChildInput {
  householdId: string;
  name: string;
  birthdate?: string;
}

export interface InviteCoParentInput {
  householdId: string;
  invitedByUserId: string;
  inviteeEmail: string;
}

export interface HouseholdRecord {
  id: string;
  name: string;
  primaryTimezone: string;
  createdByUserId: string;
}

export interface ChildRecord {
  id: string;
  householdId: string;
  name: string;
  birthdate?: string;
}

export interface HouseholdInviteRecord {
  id: string;
  householdId: string;
  invitedByUserId: string;
  inviteeEmail: string;
  status: 'pending';
}

export function createHousehold(input: CreateHouseholdInput): HouseholdRecord {
  return {
    id: `household-${crypto.randomUUID()}`,
    name: input.householdName,
    primaryTimezone: input.timezone ?? 'America/New_York',
    createdByUserId: input.ownerUserId
  };
}

export function createChild(input: CreateChildInput): ChildRecord {
  return {
    id: `child-${crypto.randomUUID()}`,
    householdId: input.householdId,
    name: input.name,
    birthdate: input.birthdate
  };
}

export function createCoParentInvite(input: InviteCoParentInput): HouseholdInviteRecord {
  return {
    id: `invite-${crypto.randomUUID()}`,
    householdId: input.householdId,
    invitedByUserId: input.invitedByUserId,
    inviteeEmail: input.inviteeEmail,
    status: 'pending'
  };
}
