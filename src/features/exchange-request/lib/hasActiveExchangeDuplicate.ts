import type { ExchangeRequest } from '@/entities/exchange-request';
import { isExchangeActive } from '@/entities/exchange-request';

interface HasActiveExchangeDuplicateParams {
  exchangeRequests: ExchangeRequest[];
  skillId: number;
  requesterUserId: number;
}

export const hasActiveExchangeDuplicate = ({
  exchangeRequests,
  skillId,
  requesterUserId,
}: HasActiveExchangeDuplicateParams): boolean =>
  exchangeRequests.some(
    (exchangeRequest) =>
      exchangeRequest.skillId === skillId &&
      exchangeRequest.requesterUserId === requesterUserId &&
      isExchangeActive(exchangeRequest),
  );
