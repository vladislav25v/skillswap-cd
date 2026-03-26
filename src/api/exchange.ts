import type { ExchangeRequest } from '@/entities/exchange-request/types';
import { request } from '@/api/request';

export const EXCHANGE_API_PATH = '/exchangeRequests';

type ExchangeRequestDto = Omit<
  ExchangeRequest,
  'id' | 'skillId' | 'ownerUserId' | 'requesterUserId'
> & {
  id: number | string;
  skillId: number | string;
  ownerUserId: number | string;
  requesterUserId: number | string;
};

const normalizeExchangeRequest = (exchangeRequest: ExchangeRequestDto): ExchangeRequest => ({
  ...exchangeRequest,
  id: Number(exchangeRequest.id),
  skillId: Number(exchangeRequest.skillId),
  ownerUserId: Number(exchangeRequest.ownerUserId),
  requesterUserId: Number(exchangeRequest.requesterUserId),
});

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
  (await request<ExchangeRequestDto[]>(EXCHANGE_API_PATH)).map(normalizeExchangeRequest);

export const getExchangeRequestById = async (
  exchangeRequestId: number,
): Promise<ExchangeRequest | null> => {
  try {
    const exchangeRequest = await request<ExchangeRequestDto>(
      `${EXCHANGE_API_PATH}/${exchangeRequestId}`,
    );

    return normalizeExchangeRequest(exchangeRequest);
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
  normalizeExchangeRequest(
    await request<ExchangeRequestDto>(EXCHANGE_API_PATH, {
      method: 'POST',
      body: payload,
    }),
  );

export const updateExchangeRequest = async (
  exchangeRequestId: number,
  payload: UpdateExchangeRequestPayload,
): Promise<ExchangeRequest> =>
  normalizeExchangeRequest(
    await request<ExchangeRequestDto>(`${EXCHANGE_API_PATH}/${exchangeRequestId}`, {
      method: 'PATCH',
      body: payload,
    }),
  );

export const getIncomingExchangeRequests = async (
  ownerUserId: number,
): Promise<ExchangeRequest[]> =>
  (
    await request<ExchangeRequestDto[]>(EXCHANGE_API_PATH, {
      query: {
        ownerUserId,
      },
    })
  ).map(normalizeExchangeRequest);

export const getOutgoingExchangeRequests = async (
  requesterUserId: number,
): Promise<ExchangeRequest[]> =>
  (
    await request<ExchangeRequestDto[]>(EXCHANGE_API_PATH, {
      query: {
        requesterUserId,
      },
    })
  ).map(normalizeExchangeRequest);

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
