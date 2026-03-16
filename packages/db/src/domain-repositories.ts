import { InMemoryRepository } from './repositories';

export interface UserRow {
  id: string;
  email: string;
  fullName: string;
}

export interface HouseholdRow {
  id: string;
  name: string;
  primaryTimezone: string;
  createdByUserId: string;
}

export interface ChildRow {
  id: string;
  householdId: string;
  name: string;
  birthdate?: string;
}

export interface InviteRow {
  id: string;
  householdId: string;
  invitedByUserId: string;
  inviteeEmail: string;
  status: 'pending';
}

export const userRepository = new InMemoryRepository<UserRow>();
export const householdRepository = new InMemoryRepository<HouseholdRow>();
export const childRepository = new InMemoryRepository<ChildRow>();
export const inviteRepository = new InMemoryRepository<InviteRow>();
