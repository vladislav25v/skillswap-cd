import type { Account } from '@/entities/account/types';
import type { UpdateAccountPayload } from '@/features/auth/types';
import { request } from '@/api/request';

export const ACCOUNT_API_PATH = '/accounts';

export interface CreateAccountPayload {
  email: string;
  password: string;
  userId: number;
  createdAt: string;
}

export const getAccountById = async (accountId: number): Promise<Account | null> => {
  try {
    return await request<Account>(`${ACCOUNT_API_PATH}/${accountId}`);
  } catch (error) {
    if (error instanceof Error && error.message.endsWith('404')) {
      return null;
    }

    throw error;
  }
};

export const getAccountByEmail = async (email: string): Promise<Account | null> => {
  const accounts = await request<Account[]>(ACCOUNT_API_PATH, {
    query: {
      email,
    },
  });

  return accounts[0] ?? null;
};

export const createAccount = async (payload: CreateAccountPayload): Promise<Account> =>
  request<Account>(ACCOUNT_API_PATH, {
    method: 'POST',
    body: payload,
  });

export const updateAccount = async (
  accountId: number,
  payload: UpdateAccountPayload,
): Promise<Account> =>
  request<Account>(`${ACCOUNT_API_PATH}/${accountId}`, {
    method: 'PATCH',
    body: payload,
  });
