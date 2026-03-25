import type { SkillTagItem } from '@/shared/ui/Skilltags';

export interface UserCardViewModel {
  id: number;
  name: string;
  city: string;
  age: number;
  avatarSrc?: string | null;
  isFavorite?: boolean;
  teachingSkills: SkillTagItem[];
  learningSkills: SkillTagItem[];
  detailsButtonText?: string;
}
