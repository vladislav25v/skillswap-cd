import React, { useEffect, useRef } from 'react';
import styles from './Checkbox.module.css';

export interface CheckboxProps {
  checked: boolean;
  indeterminate?: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  indeterminate = false,
  onChange,
  label,
  disabled = false,
  id,
  className = '',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <label
      htmlFor={id}
      className={`${styles.root} ${disabled ? styles.disabled : ''} ${className}`}
    >
      <span className={styles.clickArea}>
        <input
          ref={inputRef}
          type="checkbox"
          id={id}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className={styles.input}
        />
        <span className={styles.box}>
          {!indeterminate && checked && <span className={styles.icon} />}
          {indeterminate && <span className={styles.indeterminate} />}
        </span>
      </span>
      {label && <span className={styles.content}>{label}</span>}
    </label>
  );
};

export default Checkbox;
