import type { User } from '@/entities/user/types';
import type { Skill } from '@/entities/skill/types';
import type { Subcategory } from '@/entities/subcategory/types';
import type { FiltersState } from '@/features/filters';

export interface FilterUsersParams {
  users: User[];
  filters: FiltersState;
  skills: Skill[];
  subcategories: Subcategory[];
}

export const filterUsers = ({
  users,
  filters,
  skills,
  subcategories,
}: FilterUsersParams): User[] => {
  const validSubcategoryIds =
    filters.skills.length > 0
      ? filters.skills
          .map((subcategoryId) => Number(subcategoryId))
          .filter((subcategoryId) => subcategories.some((sub) => sub.id === subcategoryId))
      : [];
  const skillsById = new Map(skills.map((skill) => [skill.id, skill]));

  return users.filter((user) => {
    const isWantToLearn = filters.mainFilter === 'want-to-learn';
    const isCanTeach = filters.mainFilter === 'can-teach';
    const createdSkillSubcategoryIds = user.createdSkillIds
      .map((skillId) => skillsById.get(skillId)?.subcategoryId)
      .filter((subcategoryId): subcategoryId is number => subcategoryId !== undefined);
    const canTeachSelectedSubcategory = validSubcategoryIds.some((subcategoryId) =>
      user.desiredSubcategoryIds.includes(subcategoryId),
    );
    const wantsToLearnSelectedSubcategory = validSubcategoryIds.some((subcategoryId) =>
      createdSkillSubcategoryIds.includes(subcategoryId),
    );

    if (filters.mainFilter !== 'all') {
      if (
        (isWantToLearn && user.createdSkillIds.length === 0) ||
        (isCanTeach && user.desiredSubcategoryIds.length === 0)
      ) {
        return false;
      }
    }

    if (validSubcategoryIds.length > 0) {
      const hasMatchingSkill = isWantToLearn
        ? wantsToLearnSelectedSubcategory
        : isCanTeach
          ? canTeachSelectedSubcategory
          : canTeachSelectedSubcategory || wantsToLearnSelectedSubcategory;

      if (!hasMatchingSkill) {
        return false;
      }
    }

    if (filters.authorGender !== '' && user.gender !== filters.authorGender) {
      return false;
    }

    if (filters.cities.length > 0 && !filters.cities.includes(user.cityId)) {
      return false;
    }

    return true;
  });
};
