import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '@/widgets/Header';
import { Footer } from '@/widgets/Footer';
import styles from './PublicLayout.module.css';

export const PublicLayout = () => {
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);

  // Возвращаем фокус на main при смене маршрута
  useEffect(() => {
    mainRef.current?.focus();
  }, [location.pathname]);

  return (
    <div className={styles.layout}>
      <Header />
      <main ref={mainRef} className={styles.layout__main} tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
