import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/providers/auth-context';
import LogoutIcon from '@/assets/logout.svg';
import styles from './UserDropdown.module.css';

interface UserDropdownProps {
  onClose: () => void;
}

const UserDropdown = ({ onClose }: UserDropdownProps) => {
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();

  useEffect(() => {
    const firstMenuItem = dropdownRef.current?.querySelector('button');
    firstMenuItem?.focus();
  }, []);

  const handleProfileClick = () => {
    navigate('/profile');
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const menuItems = dropdownRef.current?.querySelectorAll('button');
    if (!menuItems?.length) return;

    const currentIndex = Array.from(menuItems).findIndex((item) => item === document.activeElement);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % menuItems.length;
      (menuItems[nextIndex] as HTMLElement).focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + menuItems.length) % menuItems.length;
      (menuItems[prevIndex] as HTMLElement).focus();
    }
  };

  return (
    <div
      className={styles.dropdown}
      ref={dropdownRef}
      onKeyDown={handleKeyDown}
      role="menu"
      aria-label="Меню пользователя"
    >
      <button className={styles.menuItem} onClick={handleProfileClick} role="menuitem" tabIndex={0}>
        Личный кабинет
      </button>

      <button className={styles.menuItem} onClick={handleLogout} role="menuitem" tabIndex={0}>
        <span>Выйти из аккаунта</span>
        <img src={LogoutIcon} alt="" className={styles.icon} />
      </button>
    </div>
  );
};

export default UserDropdown;
