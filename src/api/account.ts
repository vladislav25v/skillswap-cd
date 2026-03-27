import type { Account } from '@/entities/account/types';
import type { UpdateAccountPayload } from '@/features/auth/types';
import { getUserById } from '@/api/user';
import { normalizeEntityId } from '@/api/id-normalizer';
import { request } from '@/api/request';

export const ACCOUNT_API_PATH = '/accounts';

export interface CreateAccountPayload {
  email: string;
  password: string;
  userId: number;
  createdAt: string;
}

interface RawAccount extends Omit<Account, 'id' | 'rawId' | 'userId'> {
  id: number | string;
  userId: number | string;
}

const normalizeAccount = (account: RawAccount): Account => ({
  ...account,
  rawId: account.id,
  id: normalizeEntityId('accounts', account.id),
  userId: normalizeEntityId('users', account.userId),
});

const getRawAccounts = async (): Promise<RawAccount[]> => request<RawAccount[]>(ACCOUNT_API_PATH);

export const getAccountById = async (accountId: number): Promise<Account | null> => {
  const accounts = await getRawAccounts();
  const account = accounts.find((item) => normalizeEntityId('accounts', item.id) === accountId);

  return account ? normalizeAccount(account) : null;
};

export const getAccountByEmail = async (email: string): Promise<Account | null> => {
  const accounts = await request<RawAccount[]>(ACCOUNT_API_PATH, {
    query: {
      email,
    },
  });

  return accounts[0] ? normalizeAccount(accounts[0]) : null;
};

export const createAccount = async (payload: CreateAccountPayload): Promise<Account> => {
  const user = await getUserById(payload.userId);

  return normalizeAccount(
    await request<RawAccount>(ACCOUNT_API_PATH, {
      method: 'POST',
      body: {
        ...payload,
        userId: user?.rawId ?? payload.userId,
      },
    }),
  );
};

export const updateAccount = async (
  accountId: number,
  payload: UpdateAccountPayload,
): Promise<Account> => {
  const account = await getAccountById(accountId);

  if (!account) {
    throw new Error(`Account ${accountId} not found`);
  }

  return normalizeAccount(
    await request<RawAccount>(`${ACCOUNT_API_PATH}/${account.rawId}`, {
      method: 'PATCH',
      body: payload,
    }),
  );
};

export const deleteAccount = async (accountId: number): Promise<void> => {
  const account = await getAccountById(accountId);

  if (!account) {
    return;
  }

  await request<unknown>(`${ACCOUNT_API_PATH}/${account.rawId}`, {
    method: 'DELETE',
  });
};
