import styles from './Title.module.css';
import type { FC, ReactNode } from 'react';

export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4';

export interface TitleProps {
  text?: string;
  tag?: HeadingLevel;
  looksLike?: HeadingLevel;
  children?: ReactNode;
  className?: string;
}

const Title: FC<TitleProps> = ({ tag = 'h1', looksLike, text, className, children }) => {
  const Tag = tag as HeadingLevel;
  const looks = looksLike ?? tag;

  return (
    <Tag className={[styles.title, styles[looks], className].join(' ')}>{children ?? text}</Tag>
  );
};

export default Title;
