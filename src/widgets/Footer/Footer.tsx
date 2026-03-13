import React from 'react';
import { Sparkle } from 'lucide-react';
import styles from './Footer.module.css';

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <div className={styles.logoCircle}>
            <Sparkle
              className={styles.starIcon}
              fill="var(--color-page-bg)"
              stroke="transparent"
              strokeWidth={3}
            />
          </div>
          <span className={styles.logoText}>SkillSwap</span>
        </div>

        <div className={styles.nav}>
          <div className={`${styles.column} ${styles.columnWithMarkers}`}>
            <ul className={styles.list}>
              <li>
                <a href="#" className={styles.link}>
                  О проекте
                </a>
              </li>
              <li>
                <a href="#" className={styles.link}>
                  Все навыки
                </a>
              </li>
            </ul>
          </div>

          <div className={styles.column}>
            <ul className={styles.list}>
              <li>
                <a href="#" className={styles.link}>
                  Контакты
                </a>
              </li>
              <li>
                <a href="#" className={styles.link}>
                  Блог
                </a>
              </li>
            </ul>
          </div>

          <div className={styles.column}>
            <ul className={styles.list}>
              <li>
                <a href="#" className={styles.link}>
                  Политика конфиденциальности
                </a>
              </li>
              <li>
                <a href="#" className={styles.link}>
                  Пользовательское соглашение
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>SkillSwap — 2025</p>
        </div>
      </div>
    </footer>
  );
};
