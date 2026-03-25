import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import clsx from 'clsx';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { FilterCheckboxGroup } from './components/FilterCheckboxGroup';
import type { FilterOption } from './components/FilterCheckboxGroup';
import { FilterSidebarHeader } from './components/FilterSidebarHeader';
import { FilterRoleRadioGroup } from './components/FilterRoleRadioGroup';
import { FilterGenderRadioGroup } from './components/FilterGenderRadioGroup';
import { FilterCityCheckbox } from './components/FilterCityCheckbox';
import { getCategories, getSubcategories, getCities } from '@/api';
import type { Category } from '@/entities/category/types';
import type { Subcategory } from '@/entities/subcategory/types';
import type { City } from '@/entities/city/types';
import {
  setMainFilter,
  setAuthorGender,
  toggleCitySelection,
  resetFilters,
  selectMainFilter,
  selectAuthorGender,
  selectCities,
  selectActiveFiltersCount,
} from '@/features/filters';
import styles from './FilterSidebar.module.css';

export interface FilterSidebarProps {
  className?: string;
  onError?: (error: Error) => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ className, onError }) => {
  const dispatch = useAppDispatch();
  const mainFilter = useAppSelector(selectMainFilter);
  const authorGender = useAppSelector(selectAuthorGender);
  const selectedCities = useAppSelector(selectCities);
  const activeFiltersCount = useAppSelector(selectActiveFiltersCount);

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
          onError?.(err instanceof Error ? err : new Error(errorMessage));
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
  }, [onError]);

  const handleMainFilterChange = useCallback(
    (value: string) => {
      dispatch(setMainFilter(value));
    },
    [dispatch],
  );

  const handleGenderChange = useCallback(
    (value: string) => {
      dispatch(setAuthorGender(value));
    },
    [dispatch],
  );

  const handleCityChange = useCallback(
    (cityId: number) => {
      dispatch(toggleCitySelection(cityId));
    },
    [dispatch],
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
    dispatch(resetFilters());
    setShowAllSkills(false);
    setShowAllCities(false);
    setResetKey((prev) => prev + 1);
  }, [dispatch]);

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
        <FilterRoleRadioGroup value={mainFilter} onChange={handleMainFilterChange} title="" />

        <div ref={skillsSectionRef} className={styles.skillsSection}>
          <FilterCheckboxGroup
            key={`skills-group-${resetKey}`}
            title="Навыки"
            name="skills"
            options={skillCategories}
            showAllLink={true}
            allLinkText="Все категории"
            onAllLinkClick={handleShowAllSkills}
            isAllLinkOpen={showAllSkills}
          />
        </div>

        <FilterGenderRadioGroup
          value={authorGender}
          onChange={handleGenderChange}
          title="Пол автора"
        />

        <FilterCityCheckbox
          cities={cities}
          selectedCities={selectedCities}
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
