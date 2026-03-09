import * as React from 'react';
import styles from './Input.module.css';

interface InputProps {
  value: string;
  name?: string;
  id?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  type?: 'text' | 'password' | 'search' | 'email';
  bordered?: boolean;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(props, ref) {
  const {
    value,
    name,
    id,
    placeholder,
    disabled,
    error,
    type = 'text',
    bordered = true,
    leftSlot,
    rightSlot,
    onChange,
  } = props;

  return (
    <span
      className={`${styles.input} ${error && styles.inputError} ${bordered && styles.inputBordered}`.trim()}
    >
      {leftSlot}
      <input
        ref={ref}
        value={value}
        className={styles.inputField}
        name={name}
        id={id}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        onChange={onChange}
      />
      {rightSlot}
    </span>
  );
});

export default Input;
