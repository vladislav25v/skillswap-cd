import type { User } from '@/entities/user/types';
import { request } from '@/api/request';

export const USER_API_PATH = '/users';

interface RawUser extends Omit<
  User,
  'id' | 'cityId' | 'likes' | 'desiredSubcategoryIds' | 'createdSkillIds' | 'favoriteSkillIds'
> {
  id: number | string;
  cityId: number | string;
  likes: number | string;
  desiredSubcategoryIds?: Array<number | string>;
  createdSkillIds?: Array<number | string>;
  favoriteSkillIds?: Array<number | string>;
}

const normalizeUser = (user: RawUser): User => ({
  ...user,
  id: Number(user.id),
  cityId: Number(user.cityId),
  likes: Number(user.likes),
  desiredSubcategoryIds: (user.desiredSubcategoryIds ?? []).map(Number),
  createdSkillIds: (user.createdSkillIds ?? []).map(Number),
  favoriteSkillIds: (user.favoriteSkillIds ?? []).map(Number),
});

export type CreateUserPayload = Omit<User, 'id'>;

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

export const getUsers = async (): Promise<User[]> =>
  (await request<RawUser[]>(USER_API_PATH)).map(normalizeUser);

export const getUserById = async (userId: number): Promise<User | null> => {
  try {
    const user = await request<RawUser>(`${USER_API_PATH}/${userId}`);

    return normalizeUser(user);
  } catch (error) {
    if (error instanceof Error && error.message.endsWith('404')) {
      return null;
    }

    throw error;
  }
};

export const createUser = async (payload: CreateUserPayload): Promise<User> =>
  normalizeUser(
    await request<RawUser>(USER_API_PATH, {
      method: 'POST',
      body: payload,
    }),
  );

export const updateUser = async (userId: number, payload: UpdateUserPayload): Promise<User> =>
  normalizeUser(
    await request<RawUser>(`${USER_API_PATH}/${userId}`, {
      method: 'PATCH',
      body: payload,
    }),
  );

export const deleteUser = async (userId: number): Promise<void> => {
  await request<unknown>(`${USER_API_PATH}/${userId}`, {
    method: 'DELETE',
  });
};
