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
