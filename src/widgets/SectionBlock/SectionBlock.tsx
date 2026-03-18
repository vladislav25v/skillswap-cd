import React from 'react';
import clsx from 'clsx';
import styles from './SectionBlock.module.css';

type SectionBlockProps = {
  children: React.ReactNode;
  className?: string;
};

export function SectionBlock({ children, className }: SectionBlockProps) {
  return <div className={clsx(styles.block, className)}>{children}</div>;
}
