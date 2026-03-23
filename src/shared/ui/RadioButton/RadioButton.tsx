import { Circle } from 'lucide-react';
import clsx from 'clsx';
import styles from './RadioButton.module.css';

export interface RadioButtonProps {
  name: string;
  value: string;
  checked: boolean;
  label: string;
  className?: string;
  onChange: (value: string) => void;
}

export function RadioButton({
  name,
  value,
  checked,
  label,
  className,
  onChange,
}: RadioButtonProps) {
  const handleChange = () => {
    onChange(value);
  };

  return (
    <label className={clsx(styles.radioButton, className)}>
      <input
        className={styles.input}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={handleChange}
      />
      <span className={styles.iconWrapper} aria-hidden="true">
        <Circle
          className={clsx(styles.icon, {
            [styles.iconSelected]: checked,
            [styles.iconUnselected]: !checked,
          })}
        />
        {checked && <span className={styles.dot} />}
      </span>
      <span className={styles.label}>{label}</span>
    </label>
  );
}
