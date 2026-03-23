import type { User } from '@/entities/user/types';
import type { Skill } from '@/entities/skill/types';
import type { Subcategory } from '@/entities/subcategory/types';
import type { City } from '@/entities/city/types';
import type { UserCardProps } from '@/entities/user/ui/UserCard';
import { createUserSkillTags } from '@/shared/ui/Skilltags';
import { getUserAge } from './getUserAge';

type Params = {
  user: User;
  skills: Skill[];
  subcategories: Subcategory[];
  cities: City[];
};

export const mapUserToCardProps = ({
  user,
  skills,
  subcategories,
  cities,
}: Params): UserCardProps => {
  const cityMap = new Map(cities.map((city) => [city.id, city.name]));
  const { teachingSkills, learningSkills } = createUserSkillTags({
    user,
    skills,
    subcategories,
  });

  return {
    name: user.name,
    city: cityMap.get(user.cityId) ?? 'Неизвестный город',
    age: getUserAge(user.birthDate),
    avatarSrc: user.photo,
    isFavorite: false,
    teachingSkills,
    learningSkills,
  };
};
