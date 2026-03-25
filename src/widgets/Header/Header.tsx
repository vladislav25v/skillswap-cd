import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/providers/auth-context';
import styles from './Header.module.css';
import { Logo } from '@/shared/ui/Logo/Logo';
import Nav from '@/shared/ui/Nav/Nav';
import SearchInput from '@/shared/ui/SearchInput/SearchInput';
import Button from '@/shared/ui/Button/Button';
import MoonIcon from '@/assets/moon.svg';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className={clsx(styles.header, className)}>
      <Logo />

      <Nav />

      <div className={styles.search}>
        <SearchInput placeholder="Искать навык" />
      </div>

      <button className={styles.iconButton} type="button" aria-label="Переключить тему">
        <img src={MoonIcon} alt="" className={styles.icon} />
      </button>

      <div className={styles.actions}>
        {isAuthenticated ? (
          <>
            <Button variant="secondary" onClick={() => navigate('/profile')}>
              Профиль
            </Button>
            <Button variant="primary" onClick={handleLogout}>
              Выйти
            </Button>
          </>
        ) : (
          <>
            <Button variant="secondary" onClick={() => navigate('/login')}>
              Войти
            </Button>
            <Button variant="primary" onClick={() => navigate('/register')}>
              Зарегистрироваться
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
