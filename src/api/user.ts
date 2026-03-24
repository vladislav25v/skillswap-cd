import type { User } from '@/entities/user/types';
import { request } from '@/api/request';

export const USER_API_PATH = '/users';

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
  >
>;

export const getUsers = async (): Promise<User[]> => request<User[]>(USER_API_PATH);

export const getUserById = async (userId: number): Promise<User | null> => {
  try {
    return await request<User>(`${USER_API_PATH}/${userId}`);
  } catch (error) {
    if (error instanceof Error && error.message.endsWith('404')) {
      return null;
    }

    throw error;
  }
};

export const createUser = async (payload: CreateUserPayload): Promise<User> =>
  request<User>(USER_API_PATH, {
    method: 'POST',
    body: payload,
  });

export const updateUser = async (userId: number, payload: UpdateUserPayload): Promise<User> =>
  request<User>(`${USER_API_PATH}/${userId}`, {
    method: 'PATCH',
    body: payload,
  });

export const deleteUser = async (userId: number): Promise<void> => {
  await request<unknown>(`${USER_API_PATH}/${userId}`, {
    method: 'DELETE',
  });
};
