import React, { useState, useEffect, useMemo, useRef } from 'react';
import { FilterSidebarHeader } from './components/FilterSidebarHeader';
import { FilterRoleRadioGroup } from './components/FilterRoleRadioGroup';
import { FilterCheckboxGroup } from './components/FilterCheckboxGroup';
import type { FilterOption } from './components/FilterCheckboxGroup';
import { FilterGenderRadioGroup } from './components/FilterGenderRadioGroup';
import { FilterCityCheckbox } from './components/FilterCityCheckbox';
import styles from './FilterSidebar.module.css';

export interface FilterState {
  mainFilter: string;
  skills: string[];
  authorGender: string;
  cities: number[];
}

export interface FilterSidebarProps {
  className?: string;
  onFilterChange?: (filters: FilterState) => void;
}

interface Category {
  id: number;
  name: string;
}

interface Subcategory {
  id: number;
  categoryId: number;
  name: string;
}

interface City {
  id: number;
  name: string;
}

const initialFilterState: FilterState = {
  mainFilter: 'all',
  skills: [],
  authorGender: '',
  cities: [],
};

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ className = '', onFilterChange }) => {
  const [filters, setFilters] = useState<FilterState>(initialFilterState);
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [showAllCities, setShowAllCities] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);

  const skillsSectionRef = useRef<HTMLDivElement>(null);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.mainFilter !== 'all') count++;
    count += filters.skills.length;
    if (filters.authorGender !== '') count++;
    count += filters.cities.length;
    return count;
  }, [filters]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/db/db.json');
        const data = await response.json();
        setCategories(data.categories);
        setSubcategories(data.subcategories);
        setCities(data.cities);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const skillCategories: FilterOption[] = categories.map((category) => {
    const categorySubcategories = subcategories
      .filter((sub) => sub.categoryId === category.id)
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

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange?.(updatedFilters);
  };

  const handleMainFilterChange = (value: string) => {
    handleFilterChange({ mainFilter: value });
  };

  const handleSkillsChange = (selectedValues: string[]) => {
    handleFilterChange({ skills: selectedValues });
  };

  const handleGenderChange = (value: string) => {
    handleFilterChange({ authorGender: value });
  };

  const handleCityChange = (cityId: number, checked: boolean) => {
    const newCities = checked
      ? [...filters.cities, cityId]
      : filters.cities.filter((id) => id !== cityId);
    handleFilterChange({ cities: newCities });
  };

  const handleShowAllSkills = () => {
    const newShowAllState = !showAllSkills;
    setShowAllSkills(newShowAllState);

    if (newShowAllState && skillsSectionRef.current) {
      skillsSectionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const handleShowAllCities = () => {
    setShowAllCities(!showAllCities);
  };

  const handleResetFilters = () => {
    setFilters(initialFilterState);
    setShowAllSkills(false);
    setShowAllCities(false);
    setResetKey((prev) => prev + 1);
    onFilterChange?.(initialFilterState);
  };

  if (loading) {
    return (
      <aside className={`${styles.sidebar} ${className}`}>
        <div className={styles.loading}>Loading filters...</div>
      </aside>
    );
  }

  return (
    <aside className={`${styles.sidebar} ${className}`}>
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
            onChange={handleSkillsChange}
            showAllLink={true}
            allLinkText="Все категории"
            onAllLinkClick={handleShowAllSkills}
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
