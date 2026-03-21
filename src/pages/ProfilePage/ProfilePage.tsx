import React from 'react';
import clsx from 'clsx';
import { Outlet } from 'react-router-dom';
import AsideNav from '@/widgets/AsideNav';
import styles from './ProfilePage.module.css';

export interface ProfilePageProps {
  className?: string;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ className }) => {
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
