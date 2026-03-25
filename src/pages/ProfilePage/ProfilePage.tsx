import React from 'react';
import clsx from 'clsx';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/app/providers/auth-context';
import AsideNav from '@/widgets/AsideNav';
import styles from './ProfilePage.module.css';

export interface ProfilePageProps {
  className?: string;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ className }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: `${location.pathname}${location.search}${location.hash}` }}
      />
    );
  }

  return (
    <main className={clsx(styles.main, className)}>
      <aside className={styles.sidebar}>
        <AsideNav />
      </aside>

      <div className={styles.content}>
        <Outlet />
      </div>
    </main>
  );
};

export default ProfilePage;
