import type { Skill } from '@/entities/skill/types.ts';
import type { SkillDetailsViewModel } from '@/entities/skill/view-model.ts';

interface MapSkillToDetailsViewModelParams {
  skill: Skill;
  categoryName?: string;
  subcategoryName?: string;
  headerTitle?: string;
  headerDescription?: string;
  isFavorite?: boolean;
}

export function mapSkillToDetailsViewModel({
  skill,
  categoryName,
  subcategoryName,
  headerTitle,
  headerDescription,
  isFavorite,
}: MapSkillToDetailsViewModelParams): SkillDetailsViewModel {
  const meta = [categoryName, subcategoryName].filter(Boolean).join(' / ');

  return {
    id: skill.id,
    title: skill.title,
    meta: meta || undefined,
    description: skill.description,
    images: skill.images,
    isFavorite,
    headerTitle,
    headerDescription,
  };
}
