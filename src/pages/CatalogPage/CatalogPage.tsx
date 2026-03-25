import { useEffect, useState } from 'react';
import { useAppSelector } from '@/app/store/hooks';
import { selectFilters } from '@/features/filters/selectors';
import { filterUsers } from '@/features/users-filter/usersFilter';
import { FilterSidebar } from '@/widgets/FilterSidebar';
import { SectionBlock } from '@/widgets/SectionBlock';
import UsersListSection from '@/widgets/UsersListSection';
import Button from '@/shared/ui/Button/Button';
import ChevronRight from '@/assets/chevron-right.svg';
import SortIcon from '@/assets/sort.svg';
import { UserCard } from '@/entities/user/ui/UserCard';
import type { User } from '@/entities/user/types';
import type { Skill } from '@/entities/skill/types';
import type { Subcategory } from '@/entities/subcategory/types';
import type { City } from '@/entities/city/types';
import { getUsers, getSkills, getSubcategories, getCities } from '@/api';
import { mapUserToCardProps } from '@/entities/user/lib/mapUserToCardProps';
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

  const filteredUsers = filterUsers({
    users: data.users,
    filters,
    subcategories: data.subcategories,
  });

  const hasActiveFilters =
    filters.mainFilter !== 'all' ||
    Boolean(filters.authorGender) ||
    filters.cities.length > 0 ||
    filters.skills.length > 0;

  const usersSortedByPopular = [...filteredUsers].sort((a, b) => b.likes - a.likes);
  const usersSortedByNewest = [...filteredUsers].sort(
    (a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime(),
  );

  const popularUsers = usersSortedByPopular.slice(0, 3);
  const newUsers = usersSortedByNewest.slice(0, 3);
  const recommendedUsers = filteredUsers.slice(0, 9);

  const shouldShowList = hasActiveFilters || viewMode === 'list';
  const displayedUsers = sortMode === 'popular' ? usersSortedByPopular : usersSortedByNewest;

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

  const renderUserCard = (user: User) => {
    const cardProps = mapUserToCardProps({
      user,
      skills: data.skills,
      subcategories: data.subcategories,
      cities: data.cities,
    });

    return <UserCard key={user.id} {...cardProps} />;
  };

  return (
    <div className={styles.page}>
      <main className={styles.content}>
        <FilterSidebar />

        <SectionBlock>
          {shouldShowList ? (
            <UsersListSection
              title="Входящие предложения"
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
              {displayedUsers.map(renderUserCard)}
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
                {popularUsers.map(renderUserCard)}
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
                {newUsers.map(renderUserCard)}
              </UsersListSection>

              <UsersListSection title="Рекомендуем" titleTagLooksLike="h1">
                {recommendedUsers.map(renderUserCard)}
              </UsersListSection>
            </>
          )}
        </SectionBlock>
      </main>
    </div>
  );
};
