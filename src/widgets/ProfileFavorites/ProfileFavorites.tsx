import React, { useEffect, useMemo, useState } from 'react';
import { CardsGridContainer } from '@/shared/ui/CardsGridContainer';
import { UserCard } from '@/entities/user/ui/UserCard';
import {
  getFavoriteUserIds,
  toggleFavoriteUser,
} from '@/entities/user/lib/favorites';

export interface ProfileFavoritesProps {
  className?: string;
}

interface UserApi {
  id: string;
  name: string;
  birthDate: string;
  cityId: number;
  photo?: string | null;
  desiredSubcategoryIds: number[];
  createdSkillIds: number[];
}

interface City {
  id: number;
  name: string;
}

interface Subcategory {
  id: number;
  name: string;
  categoryId: number;
}

interface SkillTagItem {
  id: number;
  label: string;
  category: string;
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
  const [users, setUsers] = useState<UserApi[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:3001/users').then((res) => res.json()),
      fetch('http://localhost:3001/cities').then((res) => res.json()),
      fetch('http://localhost:3001/subcategories').then((res) => res.json()),
    ]).then(([usersData, citiesData, subcategoriesData]) => {
      setUsers(usersData);
      setCities(citiesData);
      setSubcategories(subcategoriesData);
    });

    setFavoriteIds(getFavoriteUserIds());
  }, []);

  const favoriteUsers = useMemo(() => {
    return users.filter((user) => favoriteIds.includes(Number(user.id)));
  }, [users, favoriteIds]);

  const handleFavoriteClick = (userId: number) => {
    const updatedFavorites = toggleFavoriteUser(userId);
    setFavoriteIds(updatedFavorites);
  };

  const getCityName = (cityId: number): string => {
    return cities.find((city) => city.id === cityId)?.name ?? 'Не указан';
  };

  const getLearningSkills = (
    desiredSubcategoryIds: number[]
  ): SkillTagItem[] => {
    return desiredSubcategoryIds.map((id) => {
      const subcategory = subcategories.find((item) => item.id === id);

      return {
        id,
        label: subcategory?.name ?? `Навык ${id}`,
        category: 'default',
      };
    });
  };

  const getTeachingSkills = (createdSkillIds: number[]): SkillTagItem[] => {
    return createdSkillIds.map((id) => ({
      id,
      label: `Навык ${id}`,
      category: 'default',
    }));
  };

  if (favoriteUsers.length === 0) {
    return (
      <CardsGridContainer className={className}>
        <div>В избранном пока нет пользователей</div>
      </CardsGridContainer>
    );
  }

  return (
    <CardsGridContainer className={className}>
      {favoriteUsers.map((user) => (
        <UserCard
          key={user.id}
          name={user.name}
          city={getCityName(user.cityId)}
          age={getAge(user.birthDate)}
          avatarSrc={user.photo}
          teachingSkills={getTeachingSkills(user.createdSkillIds)}
          learningSkills={getLearningSkills(user.desiredSubcategoryIds)}
          isFavorite={true}
          onFavoriteClick={() => handleFavoriteClick(Number(user.id))}
        />
      ))}
    </CardsGridContainer>
  );
};

export default ProfileFavorites;