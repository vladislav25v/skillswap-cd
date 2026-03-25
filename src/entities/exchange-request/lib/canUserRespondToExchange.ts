import type { ExchangeRequest } from '@/entities/exchange-request/types';

export const canUserRespondToExchange = (
  exchangeRequest: ExchangeRequest,
  userId: number | null | undefined,
): boolean => {
  if (!userId) {
    return false;
  }

  return exchangeRequest.ownerUserId === userId && exchangeRequest.status === 'pending';
};
