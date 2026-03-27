import type { User } from '@/entities/user/types';
import { getCities } from '@/api/city';
import { normalizeEntityId, normalizeEntityIdList } from '@/api/id-normalizer';
import { request } from '@/api/request';
import { getSkills } from '@/api/skill';
import { getSubcategories } from '@/api/subcategory';

export const USER_API_PATH = '/users';

interface RawUser extends Omit<
  User,
  | 'id'
  | 'rawId'
  | 'cityId'
  | 'likes'
  | 'desiredSubcategoryIds'
  | 'createdSkillIds'
  | 'favoriteSkillIds'
> {
  id: number | string;
  cityId: number | string;
  likes: number | string;
  desiredSubcategoryIds?: Array<number | string>;
  createdSkillIds?: Array<number | string>;
  favoriteSkillIds?: Array<number | string>;
}

type RawUserPayload = Omit<RawUser, 'id'>;

const normalizeUser = (user: RawUser): User => ({
  ...user,
  rawId: user.id,
  id: normalizeEntityId('users', user.id),
  cityId: normalizeEntityId('cities', user.cityId),
  likes: Number(user.likes),
  desiredSubcategoryIds: normalizeEntityIdList('subcategories', user.desiredSubcategoryIds ?? []),
  createdSkillIds: normalizeEntityIdList('skills', user.createdSkillIds ?? []),
  favoriteSkillIds: normalizeEntityIdList('skills', user.favoriteSkillIds ?? []),
});

export type CreateUserPayload = Omit<User, 'id' | 'rawId'>;

export type UpdateUserPayload = Partial<
  Pick<
    User,
    | 'name'
    | 'birthDate'
    | 'cityId'
    | 'photo'
    | 'about'
    | 'gender'
    | 'registeredAt'
    | 'likes'
    | 'desiredSubcategoryIds'
    | 'createdSkillIds'
    | 'favoriteSkillIds'
  >
>;

const getRawUsers = async (): Promise<RawUser[]> => request<RawUser[]>(USER_API_PATH);

const resolveRawCityId = async (cityId: number): Promise<number | string> => {
  const cities = await getCities();
  return cities.find((city) => city.id === cityId)?.rawId ?? cityId;
};

const resolveRawSubcategoryIds = async (
  subcategoryIds: number[],
): Promise<Array<number | string>> => {
  if (subcategoryIds.length === 0) {
    return [];
  }

  const subcategories = await getSubcategories();

  return subcategoryIds.map(
    (subcategoryId) =>
      subcategories.find((subcategory) => subcategory.id === subcategoryId)?.rawId ?? subcategoryId,
  );
};

const resolveRawSkillIds = async (skillIds: number[]): Promise<Array<number | string>> => {
  if (skillIds.length === 0) {
    return [];
  }

  const skills = await getSkills();

  return skillIds.map((skillId) => skills.find((skill) => skill.id === skillId)?.rawId ?? skillId);
};

const mapPayloadToRawPayload = async (
  payload: UpdateUserPayload | CreateUserPayload,
): Promise<RawUserPayload> => {
  const rawPayload: RawUserPayload = { ...payload } as RawUserPayload;

  if (payload.cityId !== undefined) {
    rawPayload.cityId = await resolveRawCityId(payload.cityId);
  }

  if (payload.desiredSubcategoryIds !== undefined) {
    rawPayload.desiredSubcategoryIds = await resolveRawSubcategoryIds(
      payload.desiredSubcategoryIds,
    );
  }

  if (payload.createdSkillIds !== undefined) {
    rawPayload.createdSkillIds = await resolveRawSkillIds(payload.createdSkillIds);
  }

  if (payload.favoriteSkillIds !== undefined) {
    rawPayload.favoriteSkillIds = await resolveRawSkillIds(payload.favoriteSkillIds);
  }

  return rawPayload;
};

export const getUsers = async (): Promise<User[]> => (await getRawUsers()).map(normalizeUser);

export const getUserById = async (userId: number): Promise<User | null> => {
  const users = await getRawUsers();
  const user = users.find((item) => normalizeEntityId('users', item.id) === userId);

  return user ? normalizeUser(user) : null;
};

export const createUser = async (payload: CreateUserPayload): Promise<User> =>
  normalizeUser(
    await request<RawUser>(USER_API_PATH, {
      method: 'POST',
      body: await mapPayloadToRawPayload(payload),
    }),
  );

export const updateUser = async (userId: number, payload: UpdateUserPayload): Promise<User> => {
  const user = await getUserById(userId);

  if (!user) {
    throw new Error(`User ${userId} not found`);
  }

  return normalizeUser(
    await request<RawUser>(`${USER_API_PATH}/${user.rawId}`, {
      method: 'PATCH',
      body: await mapPayloadToRawPayload(payload),
    }),
  );
};

export const deleteUser = async (userId: number): Promise<void> => {
  const user = await getUserById(userId);

  if (!user) {
    return;
  }

  await request<unknown>(`${USER_API_PATH}/${user.rawId}`, {
    method: 'DELETE',
  });
};
