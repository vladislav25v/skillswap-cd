import { AUTH_SESSION_STORAGE_KEY } from '@/features/auth/config';
import type { AuthSession } from '@/features/auth/types';

const isAuthSession = (value: unknown): value is AuthSession => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const session = value as Record<string, unknown>;

  return typeof session.accountId === 'number' && typeof session.userId === 'number';
};

export const getStoredSession = (): AuthSession | null => {
  const rawValue = localStorage.getItem(AUTH_SESSION_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    const parsedValue = JSON.parse(rawValue) as unknown;

    return isAuthSession(parsedValue) ? parsedValue : null;
  } catch {
    return null;
  }
};

export const setStoredSession = (session: AuthSession) => {
  localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session));
};

export const clearStoredSession = () => {
  localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
};
