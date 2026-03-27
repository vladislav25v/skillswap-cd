export type RawId = string | number;

type EntityScope =
  | 'users'
  | 'accounts'
  | 'skills'
  | 'categories'
  | 'subcategories'
  | 'cities'
  | 'exchangeRequests';

const MAX_SAFE_HASH = 2_147_483_647;

const isNumericString = (value: string): boolean => /^\d+$/.test(value);

const hashString = (value: string): number => {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) % MAX_SAFE_HASH;
  }

  return hash === 0 ? 1 : hash;
};

export const normalizeEntityId = (scope: EntityScope, rawId: RawId): number => {
  if (typeof rawId === 'number' && Number.isFinite(rawId)) {
    return rawId;
  }

  const stringId = String(rawId);

  if (isNumericString(stringId)) {
    return Number(stringId);
  }

  return hashString(`${scope}:${stringId}`);
};

export const normalizeEntityIdList = (scope: EntityScope, rawIds: RawId[]): number[] =>
  rawIds.map((rawId) => normalizeEntityId(scope, rawId));

export const matchesNormalizedId = (
  scope: EntityScope,
  rawId: RawId,
  normalizedId: number,
): boolean => normalizeEntityId(scope, rawId) === normalizedId;
