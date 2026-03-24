import Button from '../../shared/ui/Button/Button';
import styles from './Page505.module.css';
import errorImage from '../../assets/error500.png';

export function Page505() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.content}>
          <img src={errorImage} alt="500 Error" className={styles.image} />

          <p className={styles.message}>На сервере произошла ошибка</p>

          <p className={styles.description}>Попробуйте позже или вернитесь на главную страницу</p>

          <div className={styles.buttons}>
            <Button variant="secondary" className={styles.reportButton}>
              Сообщить об ошибке
            </Button>
            <Button variant="primary" className={styles.homeButton}>
              На главную
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
