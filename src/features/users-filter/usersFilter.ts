import { findSkillOwner } from '@/entities/skill/lib/find-skill-owner';
import type { Skill } from '@/entities/skill/types';
import type { Subcategory } from '@/entities/subcategory/types';
import type { User } from '@/entities/user/types';
import type { FiltersState } from '@/features/filters';

export interface FilterSkillsParams {
  skills: Skill[];
  users: User[];
  filters: FiltersState;
  subcategories: Subcategory[];
}

export const filterSkills = ({
  skills,
  users,
  filters,
  subcategories,
}: FilterSkillsParams): Skill[] => {
  const validSubcategoryIds =
    filters.skills.length > 0
      ? filters.skills
          .map((subcategoryId) => Number(subcategoryId))
          .filter((subcategoryId) => subcategories.some((sub) => sub.id === subcategoryId))
      : [];

  return skills.filter((skill) => {
    const owner = findSkillOwner(users, skill.id);

    if (!owner) {
      return false;
    }

    const isWantToLearn = filters.mainFilter === 'want-to-learn';
    const isCanTeach = filters.mainFilter === 'can-teach';
    const matchesSelectedSkillSubcategory = validSubcategoryIds.includes(skill.subcategoryId);
    const ownerWantsSelectedSubcategory = validSubcategoryIds.some((subcategoryId) =>
      owner.desiredSubcategoryIds.includes(subcategoryId),
    );

    if (isCanTeach && owner.desiredSubcategoryIds.length === 0) {
      return false;
    }

    if (validSubcategoryIds.length > 0) {
      const hasMatchingSkill = isWantToLearn
        ? matchesSelectedSkillSubcategory
        : isCanTeach
          ? ownerWantsSelectedSubcategory
          : matchesSelectedSkillSubcategory || ownerWantsSelectedSubcategory;

      if (!hasMatchingSkill) {
        return false;
      }
    }

    if (filters.authorGender !== '' && owner.gender !== filters.authorGender) {
      return false;
    }

    if (filters.cities.length > 0 && !filters.cities.includes(owner.cityId)) {
      return false;
    }

    return true;
  });
};
