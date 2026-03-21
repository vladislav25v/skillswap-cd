import React, { useState, useCallback, useMemo } from 'react';
import clsx from 'clsx';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { Checkbox } from '../../../../shared/ui/Checkbox';
import {
  toggleCategorySelection,
  toggleSubcategorySelection,
  selectSkills,
} from '@/features/filters';
import styles from './FilterCheckboxGroup.module.css';

export interface FilterOption {
  value: string;
  label: string;
  category?: string;
  subOptions?: FilterOption[];
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
  isAllLinkOpen?: boolean;
}

interface SubcategoryListProps {
  subOptions: FilterOption[];
  name: string;
  selectedValues: string[];
  onSubOptionChange: (value: string) => void;
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
            onChange={() => onSubOptionChange(subOption.value)}
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
    <button
      type="button"
      className={className}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      aria-expanded={isOpen}
    >
      <span className={styles.filterCheckboxGroup__labelText}>{label}</span>
      <span className={styles.filterCheckboxGroup__indicator}>
        <img
          src="/src/assets/chevron-down.svg"
          alt=""
          className={clsx(
            styles.filterCheckboxGroup__arrow,
            isOpen && styles.filterCheckboxGroup__arrowUp,
          )}
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
  className,
  showAllLink = false,
  allLinkText = 'Все категории',
  onAllLinkClick,
  isAllLinkOpen = false,
}) => {
  const dispatch = useAppDispatch();
  const selectedSkills = useAppSelector(selectSkills);
  const [expandedCategoryIds, setExpandedCategoryIds] = useState<Set<string>>(new Set());

  const selectedValues = selectedSkills;

  const autoOpenCategories = useMemo(() => {
    const categoriesToOpen = new Set<string>();
    options.forEach((option) => {
      if (option.subOptions) {
        const hasSelectedSub = option.subOptions.some((sub) => selectedValues.includes(sub.value));
        if (hasSelectedSub) {
          categoriesToOpen.add(option.value);
        }
      }
    });
    return categoriesToOpen;
  }, [options, selectedValues]);

  const finalOpenCategories = useMemo(() => {
    if (selectedValues.length === 0) {
      return new Set<string>();
    }
    const result = new Set(expandedCategoryIds);
    autoOpenCategories.forEach((id) => result.add(id));
    return result;
  }, [expandedCategoryIds, autoOpenCategories, selectedValues]);

  const areAllSubOptionsSelected = useCallback(
    (subOptions: FilterOption[]): boolean => {
      if (!subOptions.length) return false;
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

  const handleSubOptionChange = useCallback(
    (value: string) => {
      const subcategoryId = Number(value);
      dispatch(toggleSubcategorySelection(subcategoryId));
    },
    [dispatch],
  );

  const handleCategoryChange = useCallback(
    (categoryId: string, subOptions?: FilterOption[]) => {
      const categoryIdNum = Number(categoryId);
      const subIds = subOptions?.map((sub) => Number(sub.value)) || [];
      const allSubsSelected =
        subOptions?.every((sub) => selectedValues.includes(sub.value)) ?? false;
      const isDeselecting = allSubsSelected;

      dispatch(
        toggleCategorySelection({
          categoryId: categoryIdNum,
          subcategoryIds: subIds,
          isDeselecting,
        }),
      );
    },
    [dispatch, selectedValues],
  );

  const getCategoryCheckboxState = useCallback(
    (subOptions?: FilterOption[], isOpen?: boolean) => {
      if (!subOptions || subOptions.length === 0) {
        return { checked: false };
      }

      const allSubSelected = areAllSubOptionsSelected(subOptions);
      const anySubSelected = isAnySubOptionSelected(subOptions);

      if (allSubSelected) {
        return { checked: true };
      }
      if (anySubSelected && isOpen) {
        return { checked: false, indeterminate: true };
      }
      return { checked: false };
    },
    [areAllSubOptionsSelected, isAnySubOptionSelected],
  );

  const handleLabelClick = useCallback((categoryValue: string) => {
    setExpandedCategoryIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryValue)) {
        newSet.delete(categoryValue);
      } else {
        newSet.add(categoryValue);
      }
      return newSet;
    });
  }, []);

  return (
    <div className={clsx(styles.filterCheckboxGroup, className)}>
      <h3 className={styles.filterCheckboxGroup__title}>{title}</h3>
      <ul className={styles.filterCheckboxGroup__list}>
        {options.map((option) => {
          const hasSubOptions = Boolean(option.subOptions?.length);
          const isOpen = finalOpenCategories.has(option.value);
          const checkboxState = getCategoryCheckboxState(option.subOptions, isOpen);

          return (
            <li key={option.value} className={styles.filterCheckboxGroup__item}>
              <div className={styles.filterCheckboxGroup__category}>
                <Checkbox
                  id={`${name}-${option.value}`}
                  checked={checkboxState.checked}
                  indeterminate={checkboxState.indeterminate ?? false}
                  onChange={() => handleCategoryChange(option.value, option.subOptions)}
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
              <span className={styles.filterCheckboxGroup__allLinkContent}>
                {allLinkText}
                <span className={styles.filterCheckboxGroup__allLinkIndicator}>
                  <img
                    src="/src/assets/chevron-down.svg"
                    alt=""
                    className={clsx(
                      styles.filterCheckboxGroup__allLinkArrow,
                      isAllLinkOpen && styles.filterCheckboxGroup__allLinkArrowUp,
                    )}
                    width="16"
                    height="16"
                  />
                </span>
              </span>
            </button>
          </li>
        )}
      </ul>
    </div>
  );
};
