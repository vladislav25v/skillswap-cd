import React, { useState, useEffect, useCallback } from 'react';
import { Checkbox } from '../Checkbox';
import styles from './FilterCheckboxGroup.module.css';

export interface FilterCheckboxGroupProps {
  title: string;
  options: FilterOption[];
  name: string;
  className?: string;
  showAllLink?: boolean;
  allLinkText?: React.ReactNode; // Оставляем React.ReactNode
  onAllLinkClick?: () => void;
  onChange?: (selectedValues: string[]) => void;
}

export interface FilterOption {
  value: string;
  label: string;
  category?: 'business' | 'art' | 'languages' | 'education' | 'home' | 'health' | 'more';
  subOptions?: FilterOption[];
  defaultChecked?: boolean;
  disabled?: boolean;
}

// Вспомогательные функции
const getInitialSelectedValues = (options: FilterOption[]): string[] => {
  const initialValues: string[] = [];
  options.forEach((option) => {
    if (option.subOptions) {
      option.subOptions.forEach((sub) => {
        if (sub.defaultChecked) {
          initialValues.push(sub.value);
        }
      });
    }
  });
  return initialValues;
};

const getInitialOpenCategories = (options: FilterOption[]): Set<string> => {
  const categoriesToOpen = new Set<string>();
  options.forEach((option) => {
    if (option.subOptions) {
      const hasSelectedSub = option.subOptions.some((sub) => sub.defaultChecked);
      if (hasSelectedSub) {
        categoriesToOpen.add(option.value);
      }
    }
  });
  return categoriesToOpen;
};

// Функция для обновления значений подкатегорий
const updateCategoryValues = (
  prev: string[],
  subOptions: FilterOption[],
  checked: boolean,
): string[] => {
  const valuesSet = new Set(prev);

  subOptions.forEach((sub) => {
    if (checked) {
      valuesSet.add(sub.value);
    } else {
      valuesSet.delete(sub.value);
    }
  });

  return Array.from(valuesSet);
};

// Компонент подкатегории
interface SubcategoryListProps {
  subOptions: FilterOption[];
  name: string;
  selectedValues: string[];
  onSubOptionChange: (value: string, checked: boolean) => void;
}

const SubcategoryList: React.FC<SubcategoryListProps> = ({
  subOptions,
  name,
  selectedValues,
  onSubOptionChange,
}) => {
  return (
    <ul className={styles.filterCheckboxGroup__sublist}>
      {subOptions.map((subOption) => (
        <li key={subOption.value} className={styles.filterCheckboxGroup__subitem}>
          <Checkbox
            id={`${name}-${subOption.value}`}
            checked={selectedValues.includes(subOption.value)}
            onChange={(checked) => onSubOptionChange(subOption.value, checked)}
            label={subOption.label}
            disabled={subOption.disabled}
          />
        </li>
      ))}
    </ul>
  );
};

// Компонент кнопки категории со стрелкой
interface CategoryButtonProps {
  onClick: () => void;
  isOpen: boolean;
  hasSubOptions: boolean;
  label: string;
  className: string;
  ariaLabel?: string;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({
  onClick,
  isOpen,
  hasSubOptions,
  label,
  className,
  ariaLabel,
}) => {
  if (!hasSubOptions) {
    return <span className={className}>{label}</span>;
  }

  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      aria-expanded={isOpen}
      aria-label={ariaLabel || label}
    >
      <span className={styles.filterCheckboxGroup__labelText}>{label}</span>
      {/* Показываем стрелку только когда категория открыта */}
      {isOpen && (
        <span className={styles.filterCheckboxGroup__indicator}>
          <img
            src="/chevron-down.svg"
            alt="Скрыть"
            className={`${styles.filterCheckboxGroup__arrow} ${styles.filterCheckboxGroup__arrowUp}`}
            width="16"
            height="16"
          />
        </span>
      )}
    </button>
  );
};

// Компонент категории
interface CategoryItemProps {
  option: FilterOption;
  name: string;
  selectedValues: string[];
  isOpen: boolean;
  hasSubOptions: boolean;
  checkboxState: { checked: boolean; indeterminate?: boolean };
  onLabelClick: (categoryValue: string) => void;
  onCategoryChange: (subOptions?: FilterOption[]) => (checked: boolean) => void;
  onSubOptionChange: (value: string, checked: boolean) => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  option,
  name,
  selectedValues,
  isOpen,
  hasSubOptions,
  checkboxState,
  onLabelClick,
  onCategoryChange,
  onSubOptionChange,
}) => {
  const handleLabelClick = () => {
    onLabelClick(option.value);
  };

  return (
    <li className={styles.filterCheckboxGroup__item}>
      <div className={styles.filterCheckboxGroup__category}>
        <Checkbox
          id={`${name}-${option.value}`}
          checked={checkboxState.checked}
          indeterminate={checkboxState.indeterminate ?? false}
          onChange={onCategoryChange(option.subOptions)}
          label=""
          disabled={option.disabled}
        />

        <CategoryButton
          onClick={handleLabelClick}
          isOpen={isOpen}
          hasSubOptions={hasSubOptions}
          label={option.label}
          className={styles.filterCheckboxGroup__label}
          ariaLabel={hasSubOptions ? `${option.label}, есть подкатегории` : undefined}
        />
      </div>

      {hasSubOptions && isOpen && (
        <SubcategoryList
          subOptions={option.subOptions!}
          name={name}
          selectedValues={selectedValues}
          onSubOptionChange={onSubOptionChange}
        />
      )}
    </li>
  );
};

export const FilterCheckboxGroup: React.FC<FilterCheckboxGroupProps> = ({
  title,
  options,
  name,
  className = '',
  showAllLink = false,
  allLinkText = 'Все категории',
  onAllLinkClick,
  onChange,
}) => {
  const [selectedValues, setSelectedValues] = useState<string[]>(() =>
    getInitialSelectedValues(options),
  );

  const [openCategories, setOpenCategories] = useState<Set<string>>(() =>
    getInitialOpenCategories(options),
  );

  useEffect(() => {
    onChange?.(selectedValues);
  }, [selectedValues, onChange]);

  const areAllSubOptionsSelected = useCallback(
    (subOptions: FilterOption[]): boolean => {
      return subOptions.every((sub) => selectedValues.includes(sub.value));
    },
    [selectedValues],
  );

  const isAnySubOptionSelected = useCallback(
    (subOptions: FilterOption[]): boolean => {
      return subOptions.some((sub) => selectedValues.includes(sub.value));
    },
    [selectedValues],
  );

  const handleSubOptionChange = useCallback((value: string, checked: boolean) => {
    setSelectedValues((prev) => {
      if (checked) {
        return [...prev, value];
      }
      return prev.filter((v) => v !== value);
    });
  }, []);

  const handleCategoryChange = useCallback(
    (subOptions?: FilterOption[]) => (checked: boolean) => {
      if (!subOptions) return;
      setSelectedValues((prev) => updateCategoryValues(prev, subOptions, checked));
    },
    [],
  );

  const handleLabelClick = useCallback((categoryValue: string) => {
    setOpenCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryValue)) {
        newSet.delete(categoryValue);
      } else {
        newSet.add(categoryValue);
      }
      return newSet;
    });
  }, []);

  const getCategoryCheckboxState = useCallback(
    (subOptions?: FilterOption[]) => {
      if (!subOptions || subOptions.length === 0) {
        return { checked: false };
      }

      const allSubSelected = areAllSubOptionsSelected(subOptions);
      const anySubSelected = isAnySubOptionSelected(subOptions);

      if (allSubSelected) {
        return { checked: true };
      }

      if (anySubSelected) {
        return { checked: false, indeterminate: true };
      }

      return { checked: false };
    },
    [areAllSubOptionsSelected, isAnySubOptionSelected],
  );

  const renderCategory = (option: FilterOption) => {
    const checkboxState = getCategoryCheckboxState(option.subOptions);
    const hasSubOptions = Boolean(option.subOptions?.length);
    const isOpen = openCategories.has(option.value);

    return (
      <CategoryItem
        key={option.value}
        option={option}
        name={name}
        selectedValues={selectedValues}
        isOpen={isOpen}
        hasSubOptions={hasSubOptions}
        checkboxState={checkboxState}
        onLabelClick={handleLabelClick}
        onCategoryChange={handleCategoryChange}
        onSubOptionChange={handleSubOptionChange}
      />
    );
  };

  return (
    <div className={`${styles.filterCheckboxGroup} ${className}`}>
      <h3 className={styles.filterCheckboxGroup__title}>{title}</h3>

      <ul className={styles.filterCheckboxGroup__list}>
        {options.map(renderCategory)}
        {showAllLink && (
          <li className={styles.filterCheckboxGroup__item}>
            <button
              className={styles.filterCheckboxGroup__allLink}
              onClick={onAllLinkClick}
              type="button"
            >
              {allLinkText}
            </button>
          </li>
        )}
      </ul>
    </div>
  );
};

export default FilterCheckboxGroup;
