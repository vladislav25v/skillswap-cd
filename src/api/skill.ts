import type { Skill } from '@/entities/skill/types';
import { getSubcategories } from '@/api/subcategory';
import { normalizeEntityId } from '@/api/id-normalizer';
import { request } from '@/api/request';

export const SKILL_API_PATH = '/skills';

export interface CreateSkillPayload {
  title: string;
  subcategoryId: number;
  description: string;
  images: string[];
  createdAt: string;
  likes: number;
}

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
  rawId: skill.id,
  id: normalizeEntityId('skills', skill.id),
  title: skill.title,
  subcategoryId: normalizeEntityId('subcategories', skill.subcategoryId),
  description: skill.description,
  images: skill.images,
  createdAt: skill.createdAt ?? new Date(0).toISOString(),
  likes: Number(skill.likes ?? 0),
});

const getRawSkills = async (): Promise<SkillDto[]> => request<SkillDto[]>(SKILL_API_PATH);

export const getSkills = async (): Promise<Skill[]> => {
  const skills = await getRawSkills();

  return skills.map(normalizeSkill);
};

export const getSkillById = async (skillId: number): Promise<Skill | null> => {
  const skills = await getRawSkills();
  const skill = skills.find((item) => normalizeEntityId('skills', item.id) === skillId);

  return skill ? normalizeSkill(skill) : null;
};

export const createSkill = async (payload: CreateSkillPayload): Promise<Skill> => {
  const subcategories = await getSubcategories();
  const subcategory = subcategories.find((item) => item.id === payload.subcategoryId);

  return normalizeSkill(
    await request<SkillDto>(SKILL_API_PATH, {
      method: 'POST',
      body: {
        ...payload,
        subcategoryId: subcategory?.rawId ?? payload.subcategoryId,
      },
    }),
  );
};

export const deleteSkill = async (skillId: number): Promise<void> => {
  const skill = await getSkillById(skillId);

  if (!skill) {
    return;
  }

  await request<unknown>(`${SKILL_API_PATH}/${skill.rawId}`, {
    method: 'DELETE',
  });
};
