import React from 'react';
import styles from './StepsProgressBar.module.css';
import clsx from 'clsx';

export interface StepsProgressBarProps {
  current: number;
  total: number;
  className?: string;
  children?: React.ReactNode;
}

const StepsProgressBar: React.FC<StepsProgressBarProps> = ({
  current,
  total,
  className,
  children,
}) => {
  return (
    <div className={styles.wrapper}>
      {children}
      <div className={clsx(styles.steps, className)} aria-hidden={true}>
        {Array.from({ length: total }).map((_, index) => (
          <span
            className={clsx(styles.stepItem, index + 1 === current && styles.stepItemCurrent)}
            key={index}
          />
        ))}
      </div>
    </div>
  );
};

export default StepsProgressBar;
