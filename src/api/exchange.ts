import type { ExchangeRequest } from '@/entities/exchange-request/types';
import { getSkillById } from '@/api/skill';
import { getUserById } from '@/api/user';
import { normalizeEntityId } from '@/api/id-normalizer';
import { request } from '@/api/request';

export const EXCHANGE_API_PATH = '/exchangeRequests';

type ExchangeRequestDto = Omit<
  ExchangeRequest,
  'id' | 'rawId' | 'skillId' | 'ownerUserId' | 'requesterUserId'
> & {
  id: number | string;
  skillId: number | string;
  ownerUserId: number | string;
  requesterUserId: number | string;
};

const normalizeExchangeRequest = (exchangeRequest: ExchangeRequestDto): ExchangeRequest => ({
  ...exchangeRequest,
  rawId: exchangeRequest.id,
  id: normalizeEntityId('exchangeRequests', exchangeRequest.id),
  skillId: normalizeEntityId('skills', exchangeRequest.skillId),
  ownerUserId: normalizeEntityId('users', exchangeRequest.ownerUserId),
  requesterUserId: normalizeEntityId('users', exchangeRequest.requesterUserId),
});

export type CreateExchangeRequestPayload = Omit<ExchangeRequest, 'id' | 'rawId'>;

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

const getRawExchangeRequests = async (): Promise<ExchangeRequestDto[]> =>
  request<ExchangeRequestDto[]>(EXCHANGE_API_PATH);

const mapPayloadToRawPayload = async (
  payload: CreateExchangeRequestPayload | UpdateExchangeRequestPayload,
): Promise<Record<string, unknown>> => {
  const rawPayload: Record<string, unknown> = { ...payload };

  if (payload.skillId !== undefined) {
    rawPayload.skillId = (await getSkillById(payload.skillId))?.rawId ?? payload.skillId;
  }

  if (payload.ownerUserId !== undefined) {
    rawPayload.ownerUserId = (await getUserById(payload.ownerUserId))?.rawId ?? payload.ownerUserId;
  }

  if (payload.requesterUserId !== undefined) {
    rawPayload.requesterUserId =
      (await getUserById(payload.requesterUserId))?.rawId ?? payload.requesterUserId;
  }

  return rawPayload;
};

export const getExchangeRequests = async (): Promise<ExchangeRequest[]> =>
  (await getRawExchangeRequests()).map(normalizeExchangeRequest);

export const getExchangeRequestById = async (
  exchangeRequestId: number,
): Promise<ExchangeRequest | null> => {
  const exchangeRequests = await getRawExchangeRequests();
  const exchangeRequest = exchangeRequests.find(
    (item) => normalizeEntityId('exchangeRequests', item.id) === exchangeRequestId,
  );

  return exchangeRequest ? normalizeExchangeRequest(exchangeRequest) : null;
};

export const createExchangeRequest = async (
  payload: CreateExchangeRequestPayload,
): Promise<ExchangeRequest> =>
  normalizeExchangeRequest(
    await request<ExchangeRequestDto>(EXCHANGE_API_PATH, {
      method: 'POST',
      body: await mapPayloadToRawPayload(payload),
    }),
  );

export const updateExchangeRequest = async (
  exchangeRequestId: number,
  payload: UpdateExchangeRequestPayload,
): Promise<ExchangeRequest> => {
  const exchangeRequest = await getExchangeRequestById(exchangeRequestId);

  if (!exchangeRequest) {
    throw new Error(`Exchange request ${exchangeRequestId} not found`);
  }

  return normalizeExchangeRequest(
    await request<ExchangeRequestDto>(`${EXCHANGE_API_PATH}/${exchangeRequest.rawId}`, {
      method: 'PATCH',
      body: await mapPayloadToRawPayload(payload),
    }),
  );
};

export const getIncomingExchangeRequests = async (
  ownerUserId: number,
): Promise<ExchangeRequest[]> => {
  const exchangeRequests = await getExchangeRequests();

  return exchangeRequests.filter((exchangeRequest) => exchangeRequest.ownerUserId === ownerUserId);
};

export const getOutgoingExchangeRequests = async (
  requesterUserId: number,
): Promise<ExchangeRequest[]> => {
  const exchangeRequests = await getExchangeRequests();

  return exchangeRequests.filter(
    (exchangeRequest) => exchangeRequest.requesterUserId === requesterUserId,
  );
};

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
