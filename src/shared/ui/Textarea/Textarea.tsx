import * as React from 'react';
import { useContext } from 'react';
import clsx from 'clsx';
import { FormFieldContext } from '@/shared/ui/FormField';
import styles from './Textarea.module.css';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: string;
  bordered?: boolean;
  rightSlot?: React.ReactNode;
};

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(props, ref) {
    const { rightSlot, bordered = true, id, value, error, className, ...rest } = props;
    const { fieldId, fieldError } = useContext(FormFieldContext);

    return (
      <span
        className={clsx(
          styles.textarea,
          (fieldError || error) && styles.error,
          bordered && styles.bordered,
          className,
        )}
      >
        <textarea
          {...rest}
          ref={ref}
          value={value}
          id={fieldId ?? id ?? null}
          className={styles.textareaField}
        />
        {rightSlot}
      </span>
    );
  },
);

export default Textarea;
