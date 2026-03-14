import styles from './Header.module.css';
import { Logo } from '@/shared/ui/Logo/Logo';
import Nav from '@/shared/ui/Nav/Nav';
import SearchInput from '@/shared/ui/SearchInput/SearchInput';
import Button from '@/shared/ui/Button/Button';
import MoonIcon from '@/assets/moon.svg';

export function Header() {
  return (
    <header className={styles.header}>
      <Logo />

      <Nav />

      <div className={styles.search}>
        <SearchInput placeholder="Искать навык" />
      </div>

      <button className={styles.iconButton} type="button" aria-label="theme">
        <img src={MoonIcon} alt="" className={styles.icon} />
      </button>
      <div className={styles.actions}>
        <Button variant="secondary">Войти</Button>
        <Button variant="primary">Зарегистрироваться</Button>
      </div>
    </header>
  );
}
