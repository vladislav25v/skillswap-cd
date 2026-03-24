//import React from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import Button from '../../shared/ui/Button/Button';
import errorImage from '../../assets/404-icon.svg';
import styles from './ErrorPage404.module.css';

export const ErrorPage404 = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className={styles.page}>
      <div className={styles.imageWrapper}>
        <img src={errorImage} alt="Страница не найдена" className={styles.image} />
      </div>
      <div className={styles.content}>
        <div className={styles.textBlock}>
          <h2 className={styles.title}>Страница не найдена</h2>
          <p className={styles.description}>
            К сожалению, эта страница недоступна. Вернитесь на главную страницу или попробуйте позже
          </p>
        </div>
        <div className={styles.buttons}>
          <Button className={clsx(styles.button)} variant="secondary">
            Сообщить об ошибке
          </Button>
          <Button className={clsx(styles.button)} variant="primary" onClick={handleGoHome}>
            На главную
          </Button>
        </div>
      </div>
    </div>
  );
};
