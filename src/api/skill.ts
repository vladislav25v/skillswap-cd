import type { Skill } from '@/entities/skill/types';
import { request } from '@/api/request';

export const SKILL_API_PATH = '/skills';

type SkillDto = {
  id: number | string;
  title: string;
  subcategoryId: number | string;
  description: string;
  images: string[];
  createdAt?: string;
  likes?: number | string;
};

const normalizeSkill = (skill: SkillDto): Skill => ({
  id: Number(skill.id),
  title: skill.title,
  subcategoryId: Number(skill.subcategoryId),
  description: skill.description,
  images: skill.images,
  createdAt: skill.createdAt ?? new Date(0).toISOString(),
  likes: Number(skill.likes ?? 0),
});

export const getSkills = async (): Promise<Skill[]> => {
  const skills = await request<SkillDto[]>(SKILL_API_PATH);

  return skills.map(normalizeSkill);
};

export const getSkillById = async (skillId: number): Promise<Skill | null> => {
  try {
    const skill = await request<SkillDto>(`${SKILL_API_PATH}/${skillId}`);

    return normalizeSkill(skill);
  } catch (error) {
    if (error instanceof Error && error.message.endsWith('404')) {
      return null;
    }

    throw error;
  }
};
