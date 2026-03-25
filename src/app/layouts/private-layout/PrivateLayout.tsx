import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/app/providers/auth-context';
import { Header } from '@/widgets/Header';
import { Footer } from '@/widgets/Footer';
import styles from './PrivateLayout.module.css';

export const PrivateLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Показываем индикатор загрузки пока проверяется авторизация
  if (isLoading) {
    return (
      <div className={styles.loader}>
        <div className={styles.spinner} />
      </div>
    );
  }

  // Если не авторизован, редирект на логин
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.layout__main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
