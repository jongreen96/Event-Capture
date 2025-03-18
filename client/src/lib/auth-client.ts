import { createAuthClient } from 'better-auth/react';

export const { getSession, signIn, signOut } = createAuthClient();
