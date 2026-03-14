import * as React from 'react';
import { useContext } from 'react';
import styles from './Input.module.css';
import { FormFieldContext } from '@/shared/ui/FormField';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
  error?: string;
  bordered?: boolean;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(props, ref) {
  const { value, className, error, id, bordered = true, leftSlot, rightSlot, ...rest } = props;
  const { fieldId, fieldError } = useContext(FormFieldContext);

  return (
    <span
      className={[
        styles.input,
        (fieldError || error) && styles.inputError,
        bordered && styles.inputBordered,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {leftSlot}
      <input
        {...rest}
        ref={ref}
        value={value}
        id={fieldId ?? id ?? null}
        className={styles.inputField}
      />
      {rightSlot}
    </span>
  );
});

export default Input;
