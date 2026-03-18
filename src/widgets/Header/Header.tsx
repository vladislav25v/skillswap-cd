import clsx from 'clsx';
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
        <Button variant="secondary">Войти</Button>
        <Button variant="primary">Зарегистрироваться</Button>
      </div>
    </header>
  );
}
