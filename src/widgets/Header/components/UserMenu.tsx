import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/providers/auth-context';
import HeartIcon from '@/assets/heart.svg';
import BellIcon from '@/assets/bell.svg';
import Avatar from '@/shared/ui/Avatar/Avatar';
import styles from './UserMenu.module.css';
import UserDropdown from './UserDropdown';

interface UserMenuProps {
  user: {
    id: number;
    email: string;
    gender?: 'male' | 'female' | 'other';
    name?: string;
    photo?: string;
  };
}

export const UserMenu = ({ user: propUser }: UserMenuProps) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const { user: authUser, account } = useAuth();

  const effectiveName = authUser?.name || propUser.name;
  const effectiveEmail = account?.email || propUser.email;
  const effectivePhoto = authUser?.photo || propUser.photo || '';
  const hasUnread = false;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  useEffect(() => {
    if (!isNotificationsOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!bellRef.current?.contains(target) && !panelRef.current?.contains(target)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isNotificationsOpen]);

  const handleFavoritesClick = () => {
    navigate('/profile/favorites');
  };

  const handleNotificationsClick = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  const handleNotificationsClose = () => {
    setIsNotificationsOpen(false);
  };

  const getUserName = () => {
    if (effectiveName) return effectiveName;
    if (effectiveEmail) return effectiveEmail.split('@')[0];
    return 'Пользователь';
  };

  return (
    <div className={styles.userMenuContainer}>
      <div className={styles.bellWrapper}>
        <button
          ref={bellRef}
          className={styles.iconButton}
          onClick={handleNotificationsClick}
          aria-label="Уведомления"
          title="Уведомления"
        >
          <img src={BellIcon} alt="" className={styles.icon} />
          {hasUnread && <span className={styles.notificationDot} />}
        </button>

        {isNotificationsOpen && (
          <div ref={panelRef} className={styles.notificationPanel}>
            <div className={styles.notificationHeader}>
              <span>Уведомления</span>
              <button onClick={handleNotificationsClose} className={styles.closeButton}>
                ×
              </button>
            </div>
            <div className={styles.notificationList}>
              <p className={styles.emptyNotifications}>Нет уведомлений</p>
            </div>
          </div>
        )}
      </div>

      <button
        className={styles.iconButton}
        onClick={handleFavoritesClick}
        aria-label="Избранное"
        title="Избранное"
      >
        <img src={HeartIcon} alt="" className={styles.icon} />
      </button>

      <div className={styles.userInfo} ref={menuRef}>
        <button
          className={styles.userButton}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          aria-label="Меню пользователя"
          aria-expanded={isDropdownOpen}
        >
          <span className={styles.userName}>{getUserName()}</span>
          <Avatar
            src={effectivePhoto || undefined}
            alt={getUserName()}
            size="small"
            className={styles.avatar}
          />
        </button>

        {isDropdownOpen && <UserDropdown onClose={() => setIsDropdownOpen(false)} />}
      </div>
    </div>
  );
};
