import type { Skill } from '@/entities/skill/types';
import { request } from '@/api/request';

export function getSkills() {
  return request<Skill[]>('/skills');
}
