import React from 'react';
import styles from './UsersListSection.module.css';
import Title, { type HeadingLevel } from '@/shared/ui/Title/Title.tsx';
import { CardsGridContainer } from '@/shared/ui/CardsGridContainer';

export interface UsersListSectionProps {
  title: string;
  titleTag?: HeadingLevel;
  titleTagLooksLike?: HeadingLevel;
  headlineExtraSlot?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

const UsersListSection: React.FC<UsersListSectionProps> = ({
  title,
  titleTag = 'h2',
  titleTagLooksLike,
  className,
  headlineExtraSlot,
  children,
}) => {
  return (
    <section className={[styles.section, className].filter(Boolean).join(' ')}>
      <div className={styles.headline}>
        <Title tag={titleTag} looksLike={titleTagLooksLike}>
          {title}
        </Title>
        {headlineExtraSlot}
      </div>

      <CardsGridContainer>{children}</CardsGridContainer>
    </section>
  );
};

export default UsersListSection;
