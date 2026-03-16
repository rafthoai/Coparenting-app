import {
  childRepository,
  householdRepository,
  inviteRepository
} from '@coparenting/db/domain-repositories';

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

export async function createAndPersistHousehold(input: CreateHouseholdInput): Promise<HouseholdRecord> {
  const household = createHousehold(input);
  await householdRepository.create(household);
  return household;
}

export function createChild(input: CreateChildInput): ChildRecord {
  return {
    id: `child-${crypto.randomUUID()}`,
    householdId: input.householdId,
    name: input.name,
    birthdate: input.birthdate
  };
}

export async function createAndPersistChild(input: CreateChildInput): Promise<ChildRecord> {
  const child = createChild(input);
  await childRepository.create(child);
  return child;
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

export async function createAndPersistCoParentInvite(
  input: InviteCoParentInput
): Promise<HouseholdInviteRecord> {
  const invite = createCoParentInvite(input);
  await inviteRepository.create(invite);
  return invite;
}
