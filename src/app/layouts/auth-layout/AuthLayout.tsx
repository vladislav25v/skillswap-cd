import type { ReactNode } from 'react';
import cls from './AuthLayout.module.css';
import clsx from 'clsx';
import Title from '@/shared/ui/Title';
import StepsProgressBar from '@/shared/ui/StepsProgressBar';

export interface AuthLayoutProps {
  title?: string;
  stepInfo?: {
    current: number;
    total: number;
  };
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
}

export const AuthLayout = ({ title, stepInfo, leftSlot, rightSlot }: AuthLayoutProps) => {
  return (
    <div className={cls.layout}>
      <header className={cls.header}>
        {title ? (
          <Title tag="h2">{title}</Title>
        ) : (
          stepInfo && (
            <StepsProgressBar {...stepInfo}>
              <Title tag="h2">
                Шаг {stepInfo.current} из {stepInfo.total}
              </Title>
            </StepsProgressBar>
          )
        )}
      </header>

      <main className={cls.main}>
        <section className={clsx(cls.column, cls.leftColumn)}>{leftSlot}</section>
        {rightSlot && <aside className={clsx(cls.column, cls.rightColumn)}>{rightSlot}</aside>}
      </main>
    </div>
  );
};
