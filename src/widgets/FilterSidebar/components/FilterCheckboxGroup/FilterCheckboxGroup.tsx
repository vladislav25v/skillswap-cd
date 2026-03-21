import React, { useState, useCallback, useMemo } from 'react';
import clsx from 'clsx';
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
  value?: string[];
  isAllLinkOpen?: boolean;
}

const getInitialSelectedValues = (options: FilterOption[], externalValue?: string[]): string[] => {
  if (externalValue !== undefined) {
    return externalValue;
  }
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

const getInitialOpenCategories = (
  options: FilterOption[],
  selectedValues: string[],
): Set<string> => {
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
  onChange,
  value: externalValue,
  isAllLinkOpen = false,
}) => {
  const [internalSelectedValues, setInternalSelectedValues] = useState<string[]>(() =>
    getInitialSelectedValues(options, externalValue),
  );

  const selectedValues = externalValue !== undefined ? externalValue : internalSelectedValues;

  const openCategories = useMemo(
    () => getInitialOpenCategories(options, selectedValues),
    [options, selectedValues],
  );

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
    (value: string, checked: boolean) => {
      const newValues = checked
        ? [...selectedValues, value]
        : selectedValues.filter((v) => v !== value);

      if (externalValue === undefined) {
        setInternalSelectedValues(newValues);
      }
      onChange?.(newValues);
    },
    [selectedValues, onChange, externalValue],
  );

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

  const handleChangeSelectedValues = useCallback(
    (newValues: string[]) => {
      if (externalValue === undefined) {
        setInternalSelectedValues(newValues);
      }
      onChange?.(newValues);
    },
    [externalValue, onChange],
  );

  return (
    <div className={clsx(styles.filterCheckboxGroup, className)}>
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
                  onChange={(checked) => {
                    if (!option.subOptions) return;
                    const newValues = updateCategoryValues(
                      selectedValues,
                      option.subOptions,
                      checked,
                    );
                    handleChangeSelectedValues(newValues);
                  }}
                  label=""
                  disabled={option.disabled}
                />
                <CategoryButton
                  onClick={() => {
                    setInternalSelectedValues(selectedValues);
                  }}
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
