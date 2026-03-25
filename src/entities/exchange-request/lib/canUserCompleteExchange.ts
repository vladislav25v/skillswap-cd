import type { ExchangeRequest } from '@/entities/exchange-request/types';

export const canUserCompleteExchange = (
  exchangeRequest: ExchangeRequest,
  userId: number | null | undefined,
): boolean => {
  if (!userId) {
    return false;
  }

  const isExchangeParticipant =
    exchangeRequest.ownerUserId === userId || exchangeRequest.requesterUserId === userId;

  return isExchangeParticipant && exchangeRequest.status === 'in_progress';
};
