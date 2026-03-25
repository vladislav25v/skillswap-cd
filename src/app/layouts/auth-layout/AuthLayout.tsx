import type { ReactNode } from 'react';
import cls from './AuthLayout.module.css';

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
      {stepInfo && (
        <header className={cls.header}>
          <div className={cls.stepIndicator}>
            <span className={cls.stepCurrent}>{stepInfo.current}</span>
            <span className={cls.stepSeparator}>/</span>
            <span className={cls.stepTotal}>{stepInfo.total}</span>
          </div>
        </header>
      )}

      <main className={cls.main}>
        <section className={cls.leftColumn}>
          {title && <h1 className={cls.title}>{title}</h1>}
          {leftSlot}
        </section>
        {rightSlot && <aside className={cls.rightColumn}>{rightSlot}</aside>}
      </main>
    </div>
  );
};
