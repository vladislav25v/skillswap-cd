import React, { useCallback } from 'react';
import clsx from 'clsx';
import { Checkbox } from '../../../../shared/ui/Checkbox';
import styles from './FilterCityCheckbox.module.css';

interface City {
  id: number;
  name: string;
}

export interface FilterCityCheckboxProps {
  cities: City[];
  selectedCities: number[];
  showAll: boolean;
  onCityChange: (cityId: number, checked: boolean) => void;
  onToggleShowAll: () => void;
  title?: string;
  allCitiesText?: string;
  className?: string;
}

export const FilterCityCheckbox: React.FC<FilterCityCheckboxProps> = ({
  cities,
  selectedCities,
  showAll,
  onCityChange,
  onToggleShowAll,
  title = 'Город',
  allCitiesText = 'Все города',
  className,
}) => {
  const displayedCities = showAll ? cities : cities.slice(0, 5);

  const handleCityChange = useCallback(
    (cityId: number) => (checked: boolean) => {
      onCityChange(cityId, checked);
    },
    [onCityChange],
  );

  return (
    <div className={clsx(styles.filterCityCheckbox, className)}>
      <h3 className={styles.filterCityCheckbox__title}>{title}</h3>

      <div className={styles.filterCityCheckbox__list}>
        {displayedCities.map((city) => (
          <div key={city.id} className={styles.filterCityCheckbox__item}>
            <Checkbox
              id={`city-${city.id}`}
              checked={selectedCities.includes(city.id)}
              onChange={handleCityChange(city.id)}
              label={city.name}
            />
          </div>
        ))}

        <div className={styles.filterCityCheckbox__allLinkItem}>
          <button
            type="button"
            onClick={onToggleShowAll}
            className={styles.filterCityCheckbox__allLink}
          >
            <span className={styles.filterCityCheckbox__allLinkContent}>
              {allCitiesText}
              <span className={styles.filterCityCheckbox__allLinkIndicator}>
                <img
                  src="/src/assets/chevron-down.svg"
                  alt=""
                  className={clsx(
                    styles.filterCityCheckbox__allLinkArrow,
                    showAll && styles.filterCityCheckbox__allLinkArrowUp,
                  )}
                  width="16"
                  height="16"
                />
              </span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
