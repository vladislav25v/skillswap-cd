import type { User } from '@/entities/user/types';

export const findSkillOwner = (users: User[], skillId: number): User | null =>
  users.find((user) => user.createdSkillIds.includes(skillId)) ?? null;
