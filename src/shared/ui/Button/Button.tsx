import type { ReactNode } from 'react';
import clsx from 'clsx';
import styles from './Button.module.css';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

const Button = ({
  children,
  variant = 'primary',
  type = 'button',
  onClick,
  className,
  disabled = false,
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={clsx(styles.button, styles[variant], className)}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
