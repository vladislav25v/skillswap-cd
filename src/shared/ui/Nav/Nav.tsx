import React, { useState } from 'react';
import styles from './Nav.module.css';

const Nav: React.FC = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  // Структура данных для пунктов меню (пока пустая)
  const menuCategories: Array<{ label: string; link: string }> = [];

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className={styles.navbar}>
      <ul className={styles.navLinks}>
        {/* Ссылка "О проекте" */}
        <li>
          <a href="#about">О проекте</a>
        </li>
        {/* Пункт "Все навыки" с выпадающим меню */}
        <li className={styles.dropdownContainer}>
          <a href="#skills" onClick={toggleDropdown} className={styles.dropdownTrigger}>
            Все навыки <img src="/chevron-down.svg" alt="chevron-down" />
          </a>
          {/* Выпадающее меню */}
          {isDropdownOpen && (
            <ul className={styles.dropdownMenu}>
              {/* Здесь можно динамически рендерить пункты меню */}
              {menuCategories.length === 0 ? (
                <li>Пункты меню еще не добавлены</li>
              ) : (
                menuCategories.map((item, index) => (
                  <li key={index}>
                    <a href={item.link}>{item.label}</a>
                  </li>
                ))
              )}
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
