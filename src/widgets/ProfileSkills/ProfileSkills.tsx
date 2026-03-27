import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCities, getSkills, getSubcategories, getUsers } from '@/api';
import { useAuth } from '@/app/providers/auth-context';
import type { City } from '@/entities/city/types';
import { mapSkillToCardProps } from '@/entities/skill/lib/mapSkillToCardProps';
import { SkillCard } from '@/entities/skill/ui/SkillCard';
import type { Skill } from '@/entities/skill/types';
import type { Subcategory } from '@/entities/subcategory/types';
import type { User } from '@/entities/user/types';
import { useFavoriteSkills } from '@/features/favorite-skill';
import { CardsGridContainer } from '@/shared/ui/CardsGridContainer';

export interface ProfileSkillsProps {
  className?: string;
}

const ProfileSkills: React.FC<ProfileSkillsProps> = ({ className }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isSkillFavorite, toggleSkillFavorite } = useFavoriteSkills();
  const [users, setUsers] = useState<User[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const [usersData, citiesData, skillsData, subcategoriesData] = await Promise.all([
          getUsers(),
          getCities(),
          getSkills(),
          getSubcategories(),
        ]);

        setUsers(usersData);
        setCities(citiesData);
        setSkills(skillsData);
        setSubcategories(subcategoriesData);
      } catch {
        setErrorMessage('Не удалось загрузить ваши навыки.');
      } finally {
        setIsLoading(false);
      }
    };

    void loadData();
  }, []);

  const ownSkills = useMemo(() => {
    if (!user) {
      return [];
    }

    return skills.filter((skill) => user.createdSkillIds.includes(skill.id));
  }, [skills, user]);

  if (isLoading) {
    return (
      <CardsGridContainer className={className}>
        <div>Загрузка ваших навыков...</div>
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

  if (!user || ownSkills.length === 0) {
    return (
      <CardsGridContainer className={className}>
        <div>У вас пока нет опубликованных навыков</div>
      </CardsGridContainer>
    );
  }

  return (
    <CardsGridContainer className={className}>
      {ownSkills.map((skill) => {
        const cardProps = mapSkillToCardProps({
          skill,
          skills,
          users,
          subcategories,
          cities,
        });

        if (!cardProps) {
          return null;
        }

        return (
          <SkillCard
            key={skill.id}
            {...cardProps}
            isFavorite={isSkillFavorite(skill.id)}
            onFavoriteClick={() => {
              void toggleSkillFavorite(skill.id);
            }}
            onDetailsClick={() => navigate(`/skill/${skill.id}`)}
          />
        );
      })}
    </CardsGridContainer>
  );
};

export default ProfileSkills;
