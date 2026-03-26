import type { City } from '@/entities/city/types';
import { findSkillOwner } from '@/entities/skill/lib/find-skill-owner';
import type { Skill } from '@/entities/skill/types';
import type { Subcategory } from '@/entities/subcategory/types';
import { getUserAge } from '@/entities/user/lib/getUserAge';
import type { User } from '@/entities/user/types';
import type { SkillCardProps } from '@/entities/skill/ui/SkillCard';
import { createUserSkillTags } from '@/shared/ui/Skilltags';

type Params = {
  skill: Skill;
  skills: Skill[];
  users: User[];
  subcategories: Subcategory[];
  cities: City[];
};

export const mapSkillToCardProps = ({
  skill,
  skills,
  users,
  subcategories,
  cities,
}: Params): SkillCardProps | null => {
  const owner = findSkillOwner(users, skill.id);

  if (!owner) {
    return null;
  }

  const cityMap = new Map(cities.map((city) => [city.id, city.name]));
  const { teachingSkills, learningSkills } = createUserSkillTags({
    user: {
      createdSkillIds: [skill.id],
      desiredSubcategoryIds: owner.desiredSubcategoryIds,
    },
    skills,
    subcategories,
  });

  return {
    name: owner.name,
    city: cityMap.get(owner.cityId) ?? 'Неизвестный город',
    age: getUserAge(owner.birthDate),
    avatarSrc: owner.photo,
    isFavorite: false,
    teachingSkills,
    learningSkills,
  };
};
