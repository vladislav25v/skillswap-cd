import styles from './CardsGridContainer.module.css';

type CardsGridContainerProps = {
  children: React.ReactNode;
};

export function CardsGridContainer({ children }: CardsGridContainerProps) {
  return <div className={styles.container}>{children}</div>;
}
