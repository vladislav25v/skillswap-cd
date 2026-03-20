import type { ReactNode } from 'react';
import cls from './AuthLayout.module.scss';

export interface AuthLayoutProps {
  title: string;
  stepInfo?: {
    current: number;
    total: number;
  };
  leftSlot: ReactNode;
  rightSlot: ReactNode;
}

export const AuthLayout = ({ title, stepInfo, leftSlot, rightSlot }: AuthLayoutProps) => {
  return (
    <div className={cls.layout}>
      {/* Шапка auth-страницы */}
      <header className={cls.header}>
        <h1 className={cls.title}>{title}</h1>

        {/* Индикатор шага (если передан) */}
        {stepInfo && (
          <div className={cls.stepIndicator}>
            <span className={cls.stepCurrent}>{stepInfo.current}</span>
            <span className={cls.stepSeparator}>/</span>
            <span className={cls.stepTotal}>{stepInfo.total}</span>
          </div>
        )}
      </header>

      {/* Основной контейнер с двумя колонками */}
      <main className={cls.main}>
        {/* Левая колонка - форма */}
        <section className={cls.leftColumn}>{leftSlot}</section>

        {/* Правая колонка - изображение/текст */}
        <aside className={cls.rightColumn}>{rightSlot}</aside>
      </main>
    </div>
  );
};
