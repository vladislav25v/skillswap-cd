import { Outlet } from 'react-router-dom';
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
  useOutlet?: boolean;
}

export const AuthLayout = ({
  title,
  stepInfo,
  leftSlot,
  rightSlot,
  useOutlet = false,
}: AuthLayoutProps) => {
  const renderLeftContent = () => {
    if (leftSlot) return leftSlot;
    if (useOutlet) return <Outlet />;
    return null;
  };

  return (
    <div className={cls.layout}>
      {/* Шапка auth-страницы */}
      <header className={cls.header}>
        {title && <h1 className={cls.title}>{title}</h1>}

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
        {/* Левая колонка - форма или Outlet */}
        <section className={cls.leftColumn}>{renderLeftContent()}</section>

        {/* Правая колонка - изображение/текст */}
        {rightSlot && <aside className={cls.rightColumn}>{rightSlot}</aside>}
      </main>
    </div>
  );
};
