import type { City } from '@/entities/city/types';
import type { Skill } from '@/entities/skill/types';
import type { Subcategory } from '@/entities/subcategory/types';
import type { User } from '@/entities/user/types';
import type { UserCardViewModel } from '@/entities/user/view-model';
import { createUserSkillTags } from '@/shared/ui/Skilltags';

interface MapUserToUserCardViewModelParams {
  user: User;
  skills: Skill[];
  subcategories: Subcategory[];
  cities: City[];
  detailsButtonText?: string;
}

const getUserAge = (birthDate: string): number => {
  const birth = new Date(birthDate);

  if (Number.isNaN(birth.getTime())) {
    return 0;
  }

  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    age -= 1;
  }

  return age;
};

export const mapUserToUserCardViewModel = ({
  user,
  skills,
  subcategories,
  cities,
  detailsButtonText,
}: MapUserToUserCardViewModelParams): UserCardViewModel => {
  const city = cities.find((item) => item.id === user.cityId);
  const { teachingSkills, learningSkills } = createUserSkillTags({
    user,
    skills,
    subcategories,
  });

  return {
    id: user.id,
    name: user.name,
    city: city?.name ?? 'Не указан',
    age: getUserAge(user.birthDate),
    avatarSrc: user.photo,
    teachingSkills,
    learningSkills,
    detailsButtonText,
  };
};
