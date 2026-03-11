import styles from './CardsGridContainer.module.css';
import Button from '../Button/Button';
import ChevronRight from '@/assets/chevron-right.svg';

type CardsGridContainerProps = {
  title: string;
  children: React.ReactNode;
  onShowAll?: () => void;
};

export function CardsGridContainer({ title, children, onShowAll }: CardsGridContainerProps) {
  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>

        <Button
          variant="primary"
          className={styles.showAllButton}
          type="button"
          onClick={onShowAll}
        >
          Смотреть все
          <img src={ChevronRight} alt="" className={styles.arrowIcon} />
        </Button>
      </div>

      <div className={styles.grid}>{children}</div>
    </section>
  );
}
