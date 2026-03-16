import { userRepository } from '@coparenting/db/domain-repositories';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
}

export interface SignInInput {
  email: string;
  fullName?: string;
}

export function bootstrapAuthUser(input: SignInInput): AuthUser {
  return {
    id: `user-${crypto.randomUUID()}`,
    email: input.email,
    fullName: input.fullName ?? input.email.split('@')[0]
  };
}

export async function bootstrapAndPersistAuthUser(input: SignInInput): Promise<AuthUser> {
  const user = bootstrapAuthUser(input);
  await userRepository.create(user);
  return user;
}
