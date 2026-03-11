import React, { type ReactNode, useId } from 'react';
import styles from './FormField.module.css';
import { FormFieldContext } from '@/shared/ui/FormField/FormFieldContext.ts';

export interface FormFieldProps {
  label?: string;
  hiddenLabel?: boolean;
  htmlFor?: string;
  tip?: string;
  error?: string;
  children?: ReactNode;
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  htmlFor,
  tip,
  error,
  className,
  children,
}) => {
  const generatedId = useId();

  const fieldId = htmlFor ?? generatedId;
  const fieldError = error ?? '';

  return (
    <div className={[styles.formField, className].filter(Boolean).join(' ')}>
      {label && (
        <label className={styles.label} htmlFor={fieldId}>
          {label}
        </label>
      )}

      <FormFieldContext.Provider value={{ fieldId, fieldError }}>
        {children}
      </FormFieldContext.Provider>

      {tip && !error && <span className={styles.tip}>{tip}</span>}
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};

export default FormField;
