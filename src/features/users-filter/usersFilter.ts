import type { User, Subcategory } from '@/api/users';
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
    const isWantToLearn = filters.mainFilter === 'want-to-learn';
    const isCanTeach = filters.mainFilter === 'can-teach';

    if (filters.mainFilter !== 'all') {
      if (
        (isWantToLearn && user.desiredSubcategoryIds.length === 0) ||
        (isCanTeach && user.createdSkillIds.length === 0)
      ) {
        return false;
      }
    }

    if (validSkillIds.length > 0) {
      const hasMatchingSkill = isWantToLearn
        ? validSkillIds.some((skillId) => user.desiredSubcategoryIds.includes(skillId))
        : isCanTeach
          ? validSkillIds.some((skillId) => user.createdSkillIds.includes(skillId))
          : validSkillIds.some(
              (skillId) =>
                user.desiredSubcategoryIds.includes(skillId) ||
                user.createdSkillIds.includes(skillId),
            );

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
