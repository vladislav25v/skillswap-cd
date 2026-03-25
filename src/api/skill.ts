import type { Skill } from '@/entities/skill/types';
import { request } from '@/api/request';

export const SKILL_API_PATH = '/skills';

export const getSkills = async (): Promise<Skill[]> => request<Skill[]>(SKILL_API_PATH);

export const getSkillById = async (skillId: number): Promise<Skill | null> => {
  try {
    return await request<Skill>(`${SKILL_API_PATH}/${skillId}`);
  } catch (error) {
    if (error instanceof Error && error.message.endsWith('404')) {
      return null;
    }

    throw error;
  }
};
