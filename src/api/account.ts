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

interface RawAccount extends Omit<Account, 'id' | 'userId'> {
  id: number | string;
  userId: number | string;
}

const normalizeAccount = (account: RawAccount): Account => ({
  ...account,
  id: Number(account.id),
  userId: Number(account.userId),
});

export const getAccountById = async (accountId: number): Promise<Account | null> => {
  try {
    const account = await request<RawAccount>(`${ACCOUNT_API_PATH}/${accountId}`);

    return normalizeAccount(account);
  } catch (error) {
    if (error instanceof Error && error.message.endsWith('404')) {
      return null;
    }

    throw error;
  }
};

export const getAccountByEmail = async (email: string): Promise<Account | null> => {
  const accounts = await request<RawAccount[]>(ACCOUNT_API_PATH, {
    query: {
      email,
    },
  });

  return accounts[0] ? normalizeAccount(accounts[0]) : null;
};

export const createAccount = async (payload: CreateAccountPayload): Promise<Account> =>
  normalizeAccount(
    await request<RawAccount>(ACCOUNT_API_PATH, {
      method: 'POST',
      body: payload,
    }),
  );

export const updateAccount = async (
  accountId: number,
  payload: UpdateAccountPayload,
): Promise<Account> =>
  normalizeAccount(
    await request<RawAccount>(`${ACCOUNT_API_PATH}/${accountId}`, {
      method: 'PATCH',
      body: payload,
    }),
  );

export const deleteAccount = async (accountId: number): Promise<void> => {
  await request<unknown>(`${ACCOUNT_API_PATH}/${accountId}`, {
    method: 'DELETE',
  });
};
