import React, { useState, useEffect, useCallback } from 'react';
import { Checkbox } from '../../../../shared/ui/Checkbox';
import styles from './FilterCheckboxGroup.module.css';

export interface FilterOption {
  value: string;
  label: string;
  category?: string;
  subOptions?: FilterOption[];
  defaultChecked?: boolean;
  disabled?: boolean;
}

export interface FilterCheckboxGroupProps {
  title: string;
  options: FilterOption[];
  name: string;
  className?: string;
  showAllLink?: boolean;
  allLinkText?: React.ReactNode;
  onAllLinkClick?: () => void;
  onChange?: (selectedValues: string[]) => void;
}

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

interface CategoryButtonProps {
  onClick: () => void;
  isOpen: boolean;
  hasSubOptions: boolean;
  label: string;
  className: string;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({
  onClick,
  isOpen,
  hasSubOptions,
  label,
  className,
}) => {
  if (!hasSubOptions) {
    return <span className={className}>{label}</span>;
  }

  return (
    <button type="button" className={className} onClick={onClick} aria-expanded={isOpen}>
      <span className={styles.filterCheckboxGroup__labelText}>{label}</span>
      <span className={styles.filterCheckboxGroup__indicator}>
        <img
          src="/src/assets/chevron-down.svg"
          alt=""
          className={`${styles.filterCheckboxGroup__arrow} ${
            isOpen ? styles.filterCheckboxGroup__arrowUp : ''
          }`}
          width="16"
          height="16"
        />
      </span>
    </button>
  );
};

export const FilterCheckboxGroup: React.FC<FilterCheckboxGroupProps> = ({
  title,
  options,
  name,
  className = 'Навыки',
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

  return (
    <div className={`${styles.filterCheckboxGroup} ${className}`}>
      <h3 className={styles.filterCheckboxGroup__title}>{title}</h3>
      <ul className={styles.filterCheckboxGroup__list}>
        {options.map((option) => {
          const checkboxState = getCategoryCheckboxState(option.subOptions);
          const hasSubOptions = Boolean(option.subOptions?.length);
          const isOpen = openCategories.has(option.value);

          return (
            <li key={option.value} className={styles.filterCheckboxGroup__item}>
              <div className={styles.filterCheckboxGroup__category}>
                <Checkbox
                  id={`${name}-${option.value}`}
                  checked={checkboxState.checked}
                  indeterminate={checkboxState.indeterminate ?? false}
                  onChange={handleCategoryChange(option.subOptions)}
                  label=""
                  disabled={option.disabled}
                />
                <CategoryButton
                  onClick={() => handleLabelClick(option.value)}
                  isOpen={isOpen}
                  hasSubOptions={hasSubOptions}
                  label={option.label}
                  className={styles.filterCheckboxGroup__label}
                />
              </div>
              {hasSubOptions && isOpen && (
                <SubcategoryList
                  subOptions={option.subOptions!}
                  name={name}
                  selectedValues={selectedValues}
                  onSubOptionChange={handleSubOptionChange}
                />
              )}
            </li>
          );
        })}
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
