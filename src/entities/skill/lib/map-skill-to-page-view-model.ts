import type { Category } from '@/entities/category/types';
import type { City } from '@/entities/city/types';
import { mapSkillToDetailsViewModel } from '@/entities/skill/lib/map-skill-to-details-view-model';
import { findSkillOwner } from '@/entities/skill/lib/find-skill-owner';
import type { Skill } from '@/entities/skill/types';
import type { SkillPageViewModel } from '@/entities/skill/view-model';
import type { Subcategory } from '@/entities/subcategory/types';
import { mapUserToUserCardViewModel } from '@/entities/user/lib/map-user-to-user-card-view-model';
import type { User } from '@/entities/user/types';

interface MapSkillToPageViewModelParams {
  skill: Skill;
  skills: Skill[];
  users: User[];
  cities: City[];
  subcategories: Subcategory[];
  categories: Category[];
}

const getSimilarUserCards = ({
  targetOwnerId,
  targetSkill,
  skills,
  users,
  cities,
  subcategories,
}: {
  targetOwnerId: number;
  targetSkill: Skill;
  skills: Skill[];
  users: User[];
  cities: City[];
  subcategories: Subcategory[];
}) => {
  const similarSkillIds = new Set(
    skills
      .filter(
        (skill) => skill.id !== targetSkill.id && skill.subcategoryId === targetSkill.subcategoryId,
      )
      .map((skill) => skill.id),
  );

  return users
    .filter((user) => user.id !== targetOwnerId)
    .map((user) => ({
      user,
      targetSkillId: user.createdSkillIds.find((skillId) => similarSkillIds.has(skillId)),
    }))
    .filter(
      (
        item,
      ): item is {
        user: User;
        targetSkillId: number;
      } => item.targetSkillId !== undefined,
    )
    .slice(0, 4)
    .map(({ user, targetSkillId }) => ({
      ...mapUserToUserCardViewModel({
        user,
        skills,
        subcategories,
        cities,
      }),
      targetSkillId,
    }));
};

export const mapSkillToPageViewModel = ({
  skill,
  skills,
  users,
  cities,
  subcategories,
  categories,
}: MapSkillToPageViewModelParams): SkillPageViewModel | null => {
  const owner = findSkillOwner(users, skill.id);

  if (!owner) {
    return null;
  }

  const subcategory = subcategories.find((item) => item.id === skill.subcategoryId);
  const category = subcategory
    ? categories.find((item) => item.id === subcategory.categoryId)
    : undefined;

  return {
    skillId: skill.id,
    ownerUserId: owner.id,
    details: mapSkillToDetailsViewModel({
      skill,
      categoryName: category?.name,
      subcategoryName: subcategory?.name,
    }),
    ownerCard: mapUserToUserCardViewModel({
      user: owner,
      skills,
      subcategories,
      cities,
    }),
    similarUserCards: getSimilarUserCards({
      targetOwnerId: owner.id,
      targetSkill: skill,
      skills,
      users,
      cities,
      subcategories,
    }),
  };
};
