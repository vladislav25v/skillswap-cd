import styles from './SectionBlock.module.css';

type SectionBlockProps = {
  children: React.ReactNode;
  className?: string;
};

export function SectionBlock({ children, className }: SectionBlockProps) {
  return <div className={`${styles.block} ${className || ''}`}>{children}</div>;
}
