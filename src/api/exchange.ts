import type { ExchangeRequest } from '@/entities/exchange-request/types';
import { request } from '@/api/request';

export const EXCHANGE_API_PATH = '/exchangeRequests';

export type CreateExchangeRequestPayload = Omit<ExchangeRequest, 'id'>;

export type UpdateExchangeRequestPayload = Partial<
  Pick<
    ExchangeRequest,
    | 'skillId'
    | 'ownerUserId'
    | 'requesterUserId'
    | 'status'
    | 'createdAt'
    | 'respondedAt'
    | 'completedAt'
  >
>;

export const getExchangeRequests = async (): Promise<ExchangeRequest[]> =>
  request<ExchangeRequest[]>(EXCHANGE_API_PATH);

export const getExchangeRequestById = async (
  exchangeRequestId: number,
): Promise<ExchangeRequest | null> => {
  try {
    return await request<ExchangeRequest>(`${EXCHANGE_API_PATH}/${exchangeRequestId}`);
  } catch (error) {
    if (error instanceof Error && error.message.endsWith('404')) {
      return null;
    }

    throw error;
  }
};

export const createExchangeRequest = async (
  payload: CreateExchangeRequestPayload,
): Promise<ExchangeRequest> =>
  request<ExchangeRequest>(EXCHANGE_API_PATH, {
    method: 'POST',
    body: payload,
  });

export const updateExchangeRequest = async (
  exchangeRequestId: number,
  payload: UpdateExchangeRequestPayload,
): Promise<ExchangeRequest> =>
  request<ExchangeRequest>(`${EXCHANGE_API_PATH}/${exchangeRequestId}`, {
    method: 'PATCH',
    body: payload,
  });

export const getIncomingExchangeRequests = async (
  ownerUserId: number,
): Promise<ExchangeRequest[]> =>
  request<ExchangeRequest[]>(EXCHANGE_API_PATH, {
    query: {
      ownerUserId,
    },
  });

export const getOutgoingExchangeRequests = async (
  requesterUserId: number,
): Promise<ExchangeRequest[]> =>
  request<ExchangeRequest[]>(EXCHANGE_API_PATH, {
    query: {
      requesterUserId,
    },
  });

export const getUserExchanges = async (userId: number): Promise<ExchangeRequest[]> => {
  const [incomingExchangeRequests, outgoingExchangeRequests] = await Promise.all([
    getIncomingExchangeRequests(userId),
    getOutgoingExchangeRequests(userId),
  ]);

  const exchangeRequestsById = new Map<number, ExchangeRequest>();

  [...incomingExchangeRequests, ...outgoingExchangeRequests].forEach((exchangeRequest) => {
    exchangeRequestsById.set(exchangeRequest.id, exchangeRequest);
  });

  return [...exchangeRequestsById.values()];
};
