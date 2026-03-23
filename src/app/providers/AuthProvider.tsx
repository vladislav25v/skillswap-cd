import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { Account } from '@/entities/account/types';
import type { User } from '@/entities/user/types';
import { createAccount, getAccountByEmail, getAccountById, updateAccount } from '@/api/account';
import { createUser, deleteUser, getUserById, updateUser } from '@/api/user';
import type {
  AuthSession,
  LoginPayload,
  RegisterPayload,
  UiActionResult,
  UpdateProfilePayload,
} from '@/features/auth/types';
import {
  clearStoredSession,
  getStoredSession,
  setStoredSession,
} from '@/features/auth/auth-storage';
import { AuthContext, type AuthContextValue } from '@/app/providers/auth-context';

interface AuthProviderProps {
  children: ReactNode;
}

const SUCCESS_RESULT: UiActionResult = { ok: true };

const buildUserPayload = (payload: RegisterPayload) => ({
  name: payload.name.trim(),
  birthDate: '',
  cityId: 0,
  photo: '',
  about: '',
  gender: 'female' as const,
  registeredAt: new Date().toISOString(),
  likes: 0,
  desiredSubcategoryIds: [],
  createdSkillIds: [],
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSessionState] = useState<AuthSession | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isRegisteringRef = useRef(false);

  const resetSession = useCallback(() => {
    clearStoredSession();
    setSessionState(null);
    setAccount(null);
    setUser(null);
  }, []);

  const applySession = useCallback(
    (nextSession: AuthSession, nextAccount: Account, nextUser: User) => {
      setStoredSession(nextSession);
      setSessionState(nextSession);
      setAccount(nextAccount);
      setUser(nextUser);
    },
    [],
  );

  const restoreSession = useCallback(async () => {
    setIsLoading(true);

    const storedSession = getStoredSession();

    if (!storedSession) {
      resetSession();
      setIsLoading(false);
      return;
    }

    try {
      const [resolvedAccount, resolvedUser] = await Promise.all([
        getAccountById(storedSession.accountId),
        getUserById(storedSession.userId),
      ]);

      if (
        !resolvedAccount ||
        !resolvedUser ||
        resolvedAccount.id !== storedSession.accountId ||
        resolvedUser.id !== storedSession.userId ||
        resolvedAccount.userId !== resolvedUser.id
      ) {
        resetSession();
        setIsLoading(false);
        return;
      }

      applySession(storedSession, resolvedAccount, resolvedUser);
    } catch {
      resetSession();
    } finally {
      setIsLoading(false);
    }
  }, [applySession, resetSession]);

  useEffect(() => {
    void restoreSession();
  }, [restoreSession]);

  const login = useCallback(
    async (payload: LoginPayload): Promise<UiActionResult> => {
      try {
        const normalizedEmail = payload.email.trim().toLowerCase();
        const foundAccount = await getAccountByEmail(normalizedEmail);

        if (!foundAccount || foundAccount.password !== payload.password) {
          return {
            ok: false,
            code: 'INVALID_CREDENTIALS',
            message: 'Неверный email или пароль.',
          };
        }

        const foundUser = await getUserById(foundAccount.userId);

        if (!foundUser) {
          return {
            ok: false,
            code: 'USER_NOT_FOUND',
            message: 'Пользователь для этого аккаунта не найден.',
          };
        }

        const nextSession: AuthSession = {
          accountId: foundAccount.id,
          userId: foundUser.id,
        };

        applySession(nextSession, foundAccount, foundUser);

        return SUCCESS_RESULT;
      } catch {
        return {
          ok: false,
          code: 'UNKNOWN_ERROR',
          message: 'Не удалось выполнить вход.',
        };
      }
    },
    [applySession],
  );

  const register = useCallback(
    async (payload: RegisterPayload): Promise<UiActionResult> => {
      if (isRegisteringRef.current) {
        return {
          ok: false,
          code: 'UNKNOWN_ERROR',
          message: 'Регистрация уже выполняется.',
        };
      }

      isRegisteringRef.current = true;

      try {
        const normalizedEmail = payload.email.trim().toLowerCase();
        const existingAccount = await getAccountByEmail(normalizedEmail);

        if (existingAccount) {
          return {
            ok: false,
            code: 'EMAIL_TAKEN',
            message: 'Пользователь с таким email уже существует.',
          };
        }

        const createdUser = await createUser(buildUserPayload(payload));
        let createdAccount: Account;

        try {
          createdAccount = await createAccount({
            email: normalizedEmail,
            password: payload.password,
            userId: createdUser.id,
            createdAt: new Date().toISOString(),
          });
        } catch {
          try {
            await deleteUser(createdUser.id);
          } catch {
            // ignore rollback error
          }

          return {
            ok: false,
            code: 'UNKNOWN_ERROR',
            message: 'Не удалось зарегистрировать пользователя.',
          };
        }

        const nextSession: AuthSession = {
          accountId: createdAccount.id,
          userId: createdUser.id,
        };

        applySession(nextSession, createdAccount, createdUser);

        return SUCCESS_RESULT;
      } catch {
        return {
          ok: false,
          code: 'UNKNOWN_ERROR',
          message: 'Не удалось зарегистрировать пользователя.',
        };
      } finally {
        isRegisteringRef.current = false;
      }
    },
    [applySession],
  );

  const updateProfile = useCallback(
    async (payload: UpdateProfilePayload): Promise<UiActionResult> => {
      if (!account || !user || !session) {
        return {
          ok: false,
          code: 'INVALID_SESSION',
          message: 'Сессия пользователя невалидна.',
        };
      }

      try {
        const existingAccount = await getAccountById(account.id);

        if (!existingAccount) {
          return {
            ok: false,
            code: 'INVALID_SESSION',
            message: 'Аккаунт пользователя не найден.',
          };
        }

        const existingUser = await getUserById(user.id);

        if (!existingUser) {
          return {
            ok: false,
            code: 'PROFILE_NOT_FOUND',
            message: 'Профиль пользователя не найден.',
          };
        }

        const [updatedUser, updatedAccount] = await Promise.all([
          updateUser(existingUser.id, payload),
          updateAccount(existingAccount.id, {}),
        ]);

        applySession(session, updatedAccount, updatedUser);

        return SUCCESS_RESULT;
      } catch {
        return {
          ok: false,
          code: 'PROFILE_SAVE_FAILED',
          message: 'Не удалось сохранить профиль.',
        };
      }
    },
    [account, applySession, session, user],
  );

  const logout = useCallback(() => {
    resetSession();
  }, [resetSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      account,
      user,
      isAuthenticated: Boolean(session && account && user),
      isLoading,
      session,
      login,
      register,
      updateProfile,
      logout,
      restoreSession,
    }),
    [account, isLoading, login, logout, register, restoreSession, session, updateProfile, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
