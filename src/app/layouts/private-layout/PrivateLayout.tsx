import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/app/providers/auth-context';
import { BaseLayout } from '@/app/layouts/base-layout';
import styles from './PrivateLayout.module.css';

export const PrivateLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className={styles.loader}>
        <div className={styles.spinner} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: `${location.pathname}${location.search}${location.hash}` }}
        replace
      />
    );
  }

  return <BaseLayout />;
};
