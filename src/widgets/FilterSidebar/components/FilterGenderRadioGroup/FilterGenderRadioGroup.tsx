import React, { useCallback } from 'react';
import { RadioButton } from '../../../../shared/ui/RadioButton';
import styles from './FilterGenderRadioGroup.module.css';

export interface FilterGenderRadioGroupProps {
  value: string;
  onChange: (value: string) => void;
  title?: string;
}

export const FilterGenderRadioGroup: React.FC<FilterGenderRadioGroupProps> = ({
  value,
  onChange,
  title = 'Пол автора',
}) => {
  const handleChange = useCallback(
    (newValue: string) => {
      onChange(newValue);
    },
    [onChange],
  );

  return (
    <div className={styles.filterGenderRadioGroup}>
      <h3 className={styles.filterGenderRadioGroup__title}>{title}</h3>

      <div className={styles.filterGenderRadioGroup__list}>
        <RadioButton
          name="authorGender"
          value=""
          checked={value === ''}
          label="Не имеет значения"
          onChange={handleChange}
        />

        <RadioButton
          name="authorGender"
          value="male"
          checked={value === 'male'}
          label="Муржской"
          onChange={handleChange}
        />

        <RadioButton
          name="authorGender"
          value="female"
          checked={value === 'female'}
          label="Женский"
          onChange={handleChange}
        />
      </div>
    </div>
  );
};
