import Input, { type InputProps } from '@/shared/ui/Input';
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import styles from './PasswordInput.module.css';

export type PasswordInputProps = Omit<
  InputProps,
  'type' | 'leftSlot' | 'rightSlot' | 'onChange'
> & {
  onChange?: (value: string) => void;
};

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ onChange, ...rest }, ref) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!onChange) return;

      onChange(e.target.value);
    };

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <Input
        {...rest}
        ref={ref}
        type={showPassword ? 'text' : 'password'}
        onChange={handleChange}
        rightSlot={
          <button
            className={styles.toggleBtn}
            type={'button'}
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        }
      />
    );
  },
);

export default PasswordInput;
