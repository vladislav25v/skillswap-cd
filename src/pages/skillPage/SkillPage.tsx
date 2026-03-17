import React from 'react';
import { Header } from '../../widgets/Header';
import { Footer } from '../../widgets/Footer';
import styles from './SkillPage.module.css';

// Заглушка для Details (левая колонка)
const MockDetails = () => (
  <div className={styles.mockDetails}>
    <h2>Фотография</h2>
    <p>Научу работать в Lightroom и Photoshop</p>
    <p>Автор: Анна Петрова</p>
    <p>Категория: Творчество</p>
  </div>
);

// Заглушка для SectionBlock (правая колонка — карточка пользователя)
const MockUserCard = () => (
  <div className={styles.mockUserCard}>
    <h4>Елена Соколова</h4>
    <p>Хочет научиться фотографии</p>
    <p>Москва</p>
  </div>
);

// Заглушка для нижнего блока с похожими предложениями
const MockSimilarSection = () => (
  <div className={styles.mockSimilarSection}>
    <h3>Похожие предложения</h3>
    <div className={styles.similarGrid}>
      <div className={styles.similarCard}>Пользователь 1</div>
      <div className={styles.similarCard}>Пользователь 2</div>
      <div className={styles.similarCard}>Пользователь 3</div>
      <div className={styles.similarCard}>Пользователь 4</div>
    </div>
  </div>
);

export const SkillPage = () => {
  return (
    <>
      <Header />
      <div className={styles.pageContent}>
        {/* Верхняя часть с двумя колонками */}
        <div className={styles.skillSection}>
          {/* Правая колонка — карточка пользователя (SectionBlock) */}
          <MockUserCard />

          {/* Левая колонка — детали навыка (Details) */}
          <div className={styles.skillContainer}>
            <MockDetails />
          </div>
        </div>

        {/* Нижняя часть — похожие предложения */}
        <MockSimilarSection />
      </div>
      <Footer />
    </>
  );
};
