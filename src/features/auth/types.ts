import type { UserGender } from '@/entities/user/types';

export type UiErrorCode =
  | 'EMAIL_TAKEN'
  | 'INVALID_CREDENTIALS'
  | 'USER_NOT_FOUND'
  | 'PROFILE_NOT_FOUND'
  | 'INVALID_SESSION'
  | 'ACCOUNT_SAVE_FAILED'
  | 'PROFILE_SAVE_FAILED'
  | 'UNKNOWN_ERROR';

export type UiActionResult = { ok: true } | { ok: false; code: UiErrorCode; message: string };

export interface AuthSession {
  accountId: number;
  userId: number;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
}

export interface UpdateAccountPayload {
  email?: string;
  password?: string;
}

export interface UpdateProfilePayload {
  name: string;
  birthDate: string;
  gender: UserGender;
  cityId: number;
  photo: string;
  about: string;
}

export interface UpdateUserDataPayload {
  favoriteSkillIds?: number[];
}
