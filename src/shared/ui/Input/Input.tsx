import * as React from 'react';
import styles from './Input.module.css';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
  error?: string;
  bordered?: boolean;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(props, ref) {
  const { value, className, error, bordered = true, leftSlot, rightSlot, ...rest } = props;

  return (
    <span
      className={[
        styles.input,
        error && styles.inputError,
        bordered && styles.inputBordered,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {leftSlot}
      <input {...rest} ref={ref} value={value} className={styles.inputField} />
      {rightSlot}
    </span>
  );
});

export default Input;
