import type { ExchangeRequest } from '@/entities/exchange-request/types';

export const isExchangeActive = (exchangeRequest: ExchangeRequest): boolean =>
  exchangeRequest.status === 'pending' || exchangeRequest.status === 'in_progress';
