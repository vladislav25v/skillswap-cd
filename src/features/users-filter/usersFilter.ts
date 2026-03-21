import type { User, Subcategory } from './types';
import type { FiltersState } from '@/features/filters';

export interface FilterUsersParams {
  users: User[];
  filters: FiltersState;
  subcategories: Subcategory[];
}

export const filterUsers = ({ users, filters, subcategories }: FilterUsersParams): User[] => {
  const validSkillIds =
    filters.skills.length > 0
      ? filters.skills
          .map(Number)
          .filter((skillId) => subcategories.some((sub) => sub.id === skillId))
      : [];

  return users.filter((user) => {
    if (filters.mainFilter !== 'all') {
      const hasDesiredSkills =
        filters.mainFilter === 'want-to-learn'
          ? user.desiredSubcategoryIds.length > 0
          : user.createdSkillIds.length > 0;

      if (!hasDesiredSkills) {
        return false;
      }
    }

    if (validSkillIds.length > 0) {
      const hasMatchingSkill = validSkillIds.some(
        (skillId) =>
          user.desiredSubcategoryIds.includes(skillId) || user.createdSkillIds.includes(skillId),
      );

      if (!hasMatchingSkill) {
        return false;
      }
    }

    if (filters.authorGender !== '') {
      if (user.gender !== filters.authorGender) {
        return false;
      }
    }

    if (filters.cities.length > 0) {
      if (!filters.cities.includes(user.cityId)) {
        return false;
      }
    }

    return true;
  });
};
