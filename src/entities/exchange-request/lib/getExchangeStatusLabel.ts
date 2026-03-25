import type { ExchangeRequestStatus } from '@/entities/exchange-request/types';

const EXCHANGE_STATUS_LABELS: Record<ExchangeRequestStatus, string> = {
  pending: 'Ожидает решения',
  in_progress: 'В процессе',
  rejected: 'Отклонена',
  completed: 'Завершена',
};

export const getExchangeStatusLabel = (status: ExchangeRequestStatus): string =>
  EXCHANGE_STATUS_LABELS[status];
