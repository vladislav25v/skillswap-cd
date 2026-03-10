import React, { useState } from 'react';
import styles from './Nav.module.css';

const Nav: React.FC = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className={styles.navbar}>
      <ul className={styles.navLinks}>
        {/* Ссылка "О проекте" */}
        <li>
          <a className={styles.textNav} href="#about">
            О проекте
          </a>
        </li>
        {/* Пункт "Все навыки" с выпадающим меню */}
        <li className={styles.dropdownContainer}>
          <button
            onClick={toggleDropdown}
            className={`${styles.dropdownTrigger} ${styles.linkButton} ${styles.textNav}`}
            aria-expanded={isDropdownOpen}
            aria-controls="skills-dropdown"
          >
            Все навыки <img src="/chevron-down.svg" alt="chevron-down" />
          </button>
          {/* Выпадающее меню */}
          {isDropdownOpen && (
            <ul>
              {/* Данный ul пока используется как заглушка, на его месте будет компонент DropMenu */}
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
