import type { Skill } from '@/entities/skill/types';
import { request } from '@/api/request';

export const SKILL_API_PATH = '/skills';

export const getSkills = async (): Promise<Skill[]> => request<Skill[]>(SKILL_API_PATH);
