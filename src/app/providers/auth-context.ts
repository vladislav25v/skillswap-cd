import { createContext, useContext } from 'react';
import type { Account } from '@/entities/account/types';
import type { User } from '@/entities/user/types';
import type {
  AuthSession,
  LoginPayload,
  RegisterPayload,
  UiActionResult,
  UpdateProfilePayload,
} from '@/features/auth/types';

export interface AuthContextValue {
  account: Account | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  session: AuthSession | null;
  login: (payload: LoginPayload) => Promise<UiActionResult>;
  register: (payload: RegisterPayload) => Promise<UiActionResult>;
  updateProfile: (payload: UpdateProfilePayload) => Promise<UiActionResult>;
  logout: () => void;
  restoreSession: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth должен вызываться в AuthProvider');
  }

  return context;
};
