import { Outlet } from 'react-router-dom';
import styles from './ProfileLayout.module.css';
import SidebarNav from '@/widgets/SidebarNav';

const ProfileLayout = () => {
  return (
    <main className={styles.main}>
      <aside className={styles.sidebar}>
        <SidebarNav />
      </aside>

      <div className={styles.content}>
        <Outlet />
      </div>
    </main>
  );
};

export default ProfileLayout;
