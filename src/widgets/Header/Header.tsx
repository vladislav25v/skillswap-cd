import { useNavigate, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { useAuth } from '@/app/providers/auth-context';
import styles from './Header.module.css';
import { Logo } from '@/shared/ui/Logo/Logo';
import Nav from '@/shared/ui/Nav/Nav';
import SearchInput from '@/shared/ui/SearchInput/SearchInput';
import Button from '@/shared/ui/Button/Button';
import MoonIcon from '@/assets/moon.svg';
import { UserMenu } from './components/UserMenu';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, account } = useAuth();

  const handleLoginClick = () => {
    navigate('/login', { state: { from: location.pathname } });
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const userForMenu =
    user && account
      ? {
          id: user.id,
          email: account.email,
          name: user.name,
          gender: user.gender,
        }
      : null;

  return (
    <header className={clsx(styles.header, className)}>
      <div className={styles.container}>
        <div className={styles.leftSection}>
          <div onClick={handleLogoClick} className={styles.logoWrapper}>
            <Logo />
          </div>
          <Nav />
        </div>

        <div className={styles.searchWrapper}>
          <SearchInput placeholder="Искать навык" />
        </div>

        <div className={styles.rightSection}>
          <button className={styles.iconButton} type="button" aria-label="Переключить тему">
            <img src={MoonIcon} alt="" className={styles.icon} />
          </button>

          {isAuthenticated && userForMenu ? (
            <UserMenu user={userForMenu} />
          ) : (
            <div className={styles.authButtons}>
              <Button variant="secondary" onClick={handleLoginClick}>
                Войти
              </Button>
              <Button variant="primary" onClick={handleRegisterClick}>
                Зарегистрироваться
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
