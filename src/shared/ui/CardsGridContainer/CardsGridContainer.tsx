import styles from './CardsGridContainer.module.css';

type CardsGridContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export function CardsGridContainer({ children, className = '' }: CardsGridContainerProps) {
  return <div className={`${styles.grid} ${className}`}>{children}</div>;
}
