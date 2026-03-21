import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import clsx from 'clsx';

import { initialFilterState } from '@/features/users-filter';
import type { FilterState } from '@/features/users-filter';
import { FilterCheckboxGroup } from './components/FilterCheckboxGroup';
import type { FilterOption } from './components/FilterCheckboxGroup';
import { FilterSidebarHeader } from './components/FilterSidebarHeader';
import { FilterRoleRadioGroup } from './components/FilterRoleRadioGroup';
import { FilterGenderRadioGroup } from './components/FilterGenderRadioGroup';
import { FilterCityCheckbox } from './components/FilterCityCheckbox';
import { getCategories, getSubcategories, getCities } from '../../api/users';
import type { Category, Subcategory, City } from '../../api/users';
import styles from './FilterSidebar.module.css';

export interface FilterSidebarProps {
  className?: string;
  onFilterChange?: (filters: FilterState) => void;
  initialFilters?: Partial<FilterState>;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  className,
  onFilterChange,
  initialFilters,
}) => {
  const [filters, setFilters] = useState<FilterState>({
    ...initialFilterState,
    ...initialFilters,
  });
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [showAllCities, setShowAllCities] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const skillsSectionRef = useRef<HTMLDivElement>(null);
  const isMountedRef = useRef(true);

  const skillCategories = useMemo<FilterOption[]>(() => {
    return categories.map((category) => {
      const categorySubcategories = subcategories
        .filter((sub) => {
          const categoryIdAsNumber = Number(category.id);
          return sub.categoryId === categoryIdAsNumber;
        })
        .map((sub) => ({
          value: sub.id.toString(),
          label: sub.name,
        }));

      return {
        value: category.id.toString(),
        label: category.name,
        subOptions: categorySubcategories,
      };
    });
  }, [categories, subcategories]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.mainFilter !== 'all') count++;
    count += filters.skills.length;
    if (filters.authorGender !== '') count++;
    count += filters.cities.length;
    return count;
  }, [filters]);

  useEffect(() => {
    const abortController = new AbortController();
    isMountedRef.current = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [categoriesData, subcategoriesData, citiesData] = await Promise.all([
          getCategories(),
          getSubcategories(),
          getCities(),
        ]);

        if (isMountedRef.current) {
          setCategories(categoriesData);
          setSubcategories(subcategoriesData);
          setCities(citiesData);
        }
      } catch (err) {
        if (isMountedRef.current) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to load filter data';
          setError(errorMessage);
        }
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMountedRef.current = false;
      abortController.abort();
    };
  }, []);

  const handleFilterChange = useCallback(
    (newFilters: Partial<FilterState>) => {
      setFilters((prev) => {
        const updated = { ...prev, ...newFilters };
        onFilterChange?.(updated);
        return updated;
      });
    },
    [onFilterChange],
  );

  const handleMainFilterChange = useCallback(
    (value: string) => {
      handleFilterChange({ mainFilter: value });
    },
    [handleFilterChange],
  );

  const handleSkillsChange = useCallback(
    (selectedValues: string[]) => {
      const uniqueValues = Array.from(new Set(selectedValues));
      handleFilterChange({ skills: uniqueValues });
    },
    [handleFilterChange],
  );

  const handleGenderChange = useCallback(
    (value: string) => {
      handleFilterChange({ authorGender: value });
    },
    [handleFilterChange],
  );

  const handleCityChange = useCallback(
    (cityId: number, checked: boolean) => {
      setFilters((prev) => {
        const newCities = checked
          ? [...prev.cities, cityId]
          : prev.cities.filter((id) => id !== cityId);
        const updated = { ...prev, cities: newCities };
        onFilterChange?.(updated);
        return updated;
      });
    },
    [onFilterChange],
  );

  const handleShowAllSkills = useCallback(() => {
    const newShowAllState = !showAllSkills;
    setShowAllSkills(newShowAllState);

    if (newShowAllState && skillsSectionRef.current) {
      skillsSectionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [showAllSkills]);

  const handleShowAllCities = useCallback(() => {
    setShowAllCities(!showAllCities);
  }, [showAllCities]);

  const handleResetFilters = useCallback(() => {
    setFilters(initialFilterState);
    setShowAllSkills(false);
    setShowAllCities(false);
    setResetKey((prev) => prev + 1);
    onFilterChange?.(initialFilterState);
  }, [onFilterChange]);

  if (loading) {
    return (
      <aside className={clsx(styles.sidebar, className)}>
        <div className={styles.loading}>Loading filters...</div>
      </aside>
    );
  }

  if (error) {
    return (
      <aside className={clsx(styles.sidebar, className)}>
        <div className={styles.error}>
          <p>Failed to load filters</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </aside>
    );
  }

  return (
    <aside className={clsx(styles.sidebar, className)}>
      <FilterSidebarHeader
        activeFiltersCount={activeFiltersCount}
        onReset={handleResetFilters}
        title="Фильтры"
        resetText="Сбросить"
      />

      <div className={styles.filters}>
        <FilterRoleRadioGroup
          value={filters.mainFilter}
          onChange={handleMainFilterChange}
          title=""
        />

        <div ref={skillsSectionRef} className={styles.skillsSection}>
          <FilterCheckboxGroup
            key={`skills-group-${resetKey}`}
            title="Навыки"
            name="skills"
            options={skillCategories}
            value={filters.skills}
            onChange={handleSkillsChange}
            showAllLink={true}
            allLinkText="Все категории"
            onAllLinkClick={handleShowAllSkills}
            isAllLinkOpen={showAllSkills}
          />
        </div>

        <FilterGenderRadioGroup
          value={filters.authorGender}
          onChange={handleGenderChange}
          title="Пол автора"
        />

        <FilterCityCheckbox
          cities={cities}
          selectedCities={filters.cities}
          showAll={showAllCities}
          onCityChange={handleCityChange}
          onToggleShowAll={handleShowAllCities}
          title="Город"
          allCitiesText="Все города"
        />
      </div>
    </aside>
  );
};

export type { FilterState } from '@/features/users-filter';
