import * as React from 'react';
import { useContext } from 'react';
import clsx from 'clsx';
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

  const hasError = Boolean(fieldError || error);

  return (
    <span
      className={clsx(
        styles.input,
        {
          [styles.inputError]: hasError,
          [styles.inputBordered]: bordered,
        },
        className,
      )}
    >
      {leftSlot}
      <input {...rest} ref={ref} value={value} id={fieldId ?? id} className={styles.inputField} />
      {rightSlot}
    </span>
  );
});

export default Input;
