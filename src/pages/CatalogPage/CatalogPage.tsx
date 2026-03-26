import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/app/store/hooks';
import { useFavoriteSkills } from '@/features/favorite-skill';
import { selectFilters } from '@/features/filters/selectors';
import { filterSkills } from '@/features/users-filter/usersFilter';
import { FilterSidebar } from '@/widgets/FilterSidebar';
import { SectionBlock } from '@/widgets/SectionBlock';
import UsersListSection from '@/widgets/UsersListSection';
import Button from '@/shared/ui/Button/Button';
import ChevronRight from '@/assets/chevron-right.svg';
import SortIcon from '@/assets/sort.svg';
import type { Skill } from '@/entities/skill/types';
import type { User } from '@/entities/user/types';
import type { Subcategory } from '@/entities/subcategory/types';
import type { City } from '@/entities/city/types';
import { getUsers, getSkills, getSubcategories, getCities } from '@/api';
import { mapSkillToCardProps } from '@/entities/skill/lib/mapSkillToCardProps';
import { SkillCard } from '@/entities/skill/ui/SkillCard';
import styles from './CatalogPage.module.css';

type CatalogData = {
  users: User[];
  skills: Skill[];
  subcategories: Subcategory[];
  cities: City[];
};

type SortMode = 'popular' | 'newest';
type ViewMode = 'sections' | 'list';

export const CatalogPage = () => {
  const navigate = useNavigate();
  const { isSkillFavorite, toggleSkillFavorite } = useFavoriteSkills();
  const [data, setData] = useState<CatalogData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('sections');
  const [sortMode, setSortMode] = useState<SortMode>('newest');

  const filters = useAppSelector(selectFilters);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [users, skills, subcategories, cities] = await Promise.all([
          getUsers(),
          getSkills(),
          getSubcategories(),
          getCities(),
        ]);

        setData({ users, skills, subcategories, cities });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Не удалось загрузить каталог');
      }
    };

    void loadData();
  }, []);

  if (error) {
    return (
      <div className={styles.page}>
        <main className={styles.content}>
          <p className={styles.status}>{error}</p>
        </main>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={styles.page}>
        <main className={styles.content}>
          <p className={styles.status}>Загрузка каталога...</p>
        </main>
      </div>
    );
  }

  const filteredSkills = filterSkills({
    skills: data.skills,
    users: data.users,
    filters,
    subcategories: data.subcategories,
  });

  const hasActiveFilters =
    filters.mainFilter !== 'all' ||
    Boolean(filters.authorGender) ||
    filters.cities.length > 0 ||
    filters.skills.length > 0;

  const skillsSortedByPopular = [...filteredSkills].sort((a, b) => b.likes - a.likes);
  const skillsSortedByNewest = [...filteredSkills].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const popularSkills = skillsSortedByPopular.slice(0, 3);
  const newSkills = skillsSortedByNewest.slice(0, 3);
  const recommendedSkills = filteredSkills.slice(0, 9);

  const shouldShowList = hasActiveFilters || viewMode === 'list';
  const displayedSkills = sortMode === 'popular' ? skillsSortedByPopular : skillsSortedByNewest;
  const listTitle = hasActiveFilters
    ? `Подходящие предложения: ${displayedSkills.length}`
    : sortMode === 'popular'
      ? 'Популярное'
      : 'Новое';

  const handleShowPopular = () => {
    setViewMode('list');
    setSortMode('popular');
  };

  const handleShowNewest = () => {
    setViewMode('list');
    setSortMode('newest');
  };

  const handleToggleSortMode = () => {
    setSortMode((prev) => (prev === 'newest' ? 'popular' : 'newest'));
  };

  const renderSkillCard = (skill: Skill) => {
    const cardProps = mapSkillToCardProps({
      skill,
      skills: data.skills,
      users: data.users,
      subcategories: data.subcategories,
      cities: data.cities,
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
  };

  return (
    <div className={styles.page}>
      <main className={styles.content}>
        <FilterSidebar />

        <SectionBlock>
          {shouldShowList ? (
            <UsersListSection
              title={listTitle}
              titleTagLooksLike="h1"
              headlineExtraSlot={
                <Button
                  variant="tertiary"
                  className={styles.actionBtn}
                  onClick={handleToggleSortMode}
                >
                  <img src={SortIcon} alt="" className={styles.sortIcon} />
                  {sortMode === 'newest' ? 'Сначала популярные' : 'Сначала новые'}
                </Button>
              }
            >
              {displayedSkills.map(renderSkillCard)}
            </UsersListSection>
          ) : (
            <>
              <UsersListSection
                title="Популярное"
                titleTagLooksLike="h1"
                headlineExtraSlot={
                  <Button
                    variant="tertiary"
                    className={styles.actionBtn}
                    onClick={handleShowPopular}
                  >
                    Смотреть все
                    <img src={ChevronRight} alt="" className={styles.actionIcon} />
                  </Button>
                }
              >
                {popularSkills.map(renderSkillCard)}
              </UsersListSection>

              <UsersListSection
                title="Новое"
                titleTagLooksLike="h1"
                headlineExtraSlot={
                  <Button
                    variant="tertiary"
                    className={styles.actionBtn}
                    onClick={handleShowNewest}
                  >
                    Смотреть все
                    <img src={ChevronRight} alt="" className={styles.actionIcon} />
                  </Button>
                }
              >
                {newSkills.map(renderSkillCard)}
              </UsersListSection>

              <UsersListSection title="Рекомендуем" titleTagLooksLike="h1">
                {recommendedSkills.map(renderSkillCard)}
              </UsersListSection>
            </>
          )}
        </SectionBlock>
      </main>
    </div>
  );
};
