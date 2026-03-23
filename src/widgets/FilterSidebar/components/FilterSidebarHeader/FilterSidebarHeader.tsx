import React from 'react';
import clsx from 'clsx';
import styles from './FilterSidebarHeader.module.css';

export interface FilterSidebarHeaderProps {
  activeFiltersCount: number;
  onReset: () => void;
  title?: string;
  resetText?: string;
  className?: string;
}

export const FilterSidebarHeader: React.FC<FilterSidebarHeaderProps> = ({
  activeFiltersCount,
  onReset,
  title = 'Фильтры',
  resetText = 'Сбросить',
  className,
}) => {
  return (
    <div className={clsx(styles.top, className)}>
      <h2 className={styles.title}>
        {title}
        {activeFiltersCount > 0 && <span className={styles.counter}>({activeFiltersCount})</span>}
      </h2>

      {activeFiltersCount > 0 && (
        <button
          type="button"
          onClick={onReset}
          className={styles.clean}
          aria-label={`${resetText} все фильтры`}
        >
          {resetText}
          <span className={styles.resetIcon} aria-hidden="true">
            <img
              src="/src/assets/cross-green.svg"
              alt=""
              className={styles.resetIconImage}
              width="16"
              height="16"
            />
          </span>
        </button>
      )}
    </div>
  );
};
