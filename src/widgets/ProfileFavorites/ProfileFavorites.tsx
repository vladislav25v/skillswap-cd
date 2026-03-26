import React, { useEffect, useMemo, useState } from 'react';
import { getCities, getSkills, getSubcategories, getUsers } from '@/api';
import type { City } from '@/entities/city/types';
import type { Skill } from '@/entities/skill/types';
import type { Subcategory } from '@/entities/subcategory/types';
import type { User } from '@/entities/user/types';
import { UserCard } from '@/entities/user/ui/UserCard';
import {
  getFavoriteUserIds,
  toggleFavoriteUser,
} from '@/entities/user/lib/favorites';
import { CardsGridContainer } from '@/shared/ui/CardsGridContainer';
import { createUserSkillTags } from '@/shared/ui/Skilltags';

export interface ProfileFavoritesProps {
  className?: string;
}

const getAge = (birthDate: string): number => {
  const birth = new Date(birthDate);
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birth.getDate())
  ) {
    age -= 1;
  }

  return age;
};

const ProfileFavorites: React.FC<ProfileFavoritesProps> = ({ className }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const [usersData, citiesData, skillsData, subcategoriesData] =
          await Promise.all([
            getUsers(),
            getCities(),
            getSkills(),
            getSubcategories(),
          ]);

        setUsers(usersData);
        setCities(citiesData);
        setSkills(skillsData);
        setSubcategories(subcategoriesData);
        setFavoriteIds(getFavoriteUserIds());
      } catch {
        setErrorMessage('Не удалось загрузить избранных пользователей');
      } finally {
        setIsLoading(false);
      }
    };

    void loadData();
  }, []);

  const favoriteUsers = useMemo(() => {
    return users.filter((user) => favoriteIds.includes(Number(user.id)));
  }, [users, favoriteIds]);

  const citiesMap = useMemo(() => {
    return new Map(cities.map((city) => [Number(city.id), city.name]));
  }, [cities]);

  const handleFavoriteClick = (userId: number) => {
    const updatedFavorites = toggleFavoriteUser(userId);
    setFavoriteIds(updatedFavorites);
  };

  if (isLoading) {
    return (
      <CardsGridContainer className={className}>
        <div>Загрузка избранных пользователей...</div>
      </CardsGridContainer>
    );
  }

  if (errorMessage) {
    return (
      <CardsGridContainer className={className}>
        <div>{errorMessage}</div>
      </CardsGridContainer>
    );
  }

  if (favoriteUsers.length === 0) {
    return (
      <CardsGridContainer className={className}>
        <div>В избранном пока нет пользователей</div>
      </CardsGridContainer>
    );
  }

  return (
    <CardsGridContainer className={className}>
      {favoriteUsers.map((user) => {
        const { teachingSkills, learningSkills } = createUserSkillTags({
          user,
          skills,
          subcategories,
        });

        return (
          <UserCard
            key={user.id}
            name={user.name}
            city={citiesMap.get(Number(user.cityId)) ?? 'Не указан'}
            age={getAge(user.birthDate)}
            avatarSrc={user.photo}
            teachingSkills={teachingSkills}
            learningSkills={learningSkills}
            isFavorite
            onFavoriteClick={() => handleFavoriteClick(Number(user.id))}
          />
        );
      })}
    </CardsGridContainer>
  );
};

export default ProfileFavorites;