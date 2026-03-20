import React, { useCallback } from 'react';
import clsx from 'clsx';
import { RadioButton } from '../../../../shared/ui/RadioButton';
import styles from './FilterRoleRadioGroup.module.css';

const mainFilterOptions = [
  { value: 'all', label: 'Всё' },
  { value: 'want-to-learn', label: 'Хочу научиться' },
  { value: 'can-teach', label: 'Могу научить' },
];

export interface FilterRoleRadioGroupProps {
  value: string;
  onChange: (value: string) => void;
  title?: string;
  className?: string;
}

export const FilterRoleRadioGroup: React.FC<FilterRoleRadioGroupProps> = ({
  value,
  onChange,
  title = '',
  className,
}) => {
  const handleChange = useCallback(
    (newValue: string) => {
      onChange(newValue);
    },
    [onChange],
  );

  return (
    <div className={clsx(styles.filterRoleRadioGroup, className)}>
      {title && <h3 className={styles.filterRoleRadioGroup__title}>{title}</h3>}

      <div className={styles.filterRoleRadioGroup__list}>
        {mainFilterOptions.map((option) => (
          <RadioButton
            key={option.value}
            name="mainFilter"
            value={option.value}
            checked={value === option.value}
            label={option.label}
            onChange={handleChange}
          />
        ))}
      </div>
    </div>
  );
};
