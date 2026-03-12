import React from 'react';
import styles from './UserListSection.module.css';
import Title, { type HeadingLevel } from '@/shared/ui/Title/Title.tsx';

export interface UserListSectionProps {
  title: string;
  titleTag?: HeadingLevel;
  titleTagLooksLike?: HeadingLevel;
  headlineExtraSlot?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

const UserListSection: React.FC<UserListSectionProps> = ({
  title,
  titleTag = 'h2',
  titleTagLooksLike,
  className,
  headlineExtraSlot,
  children,
}) => {
  return (
    <section className={[styles.section, className].join(' ')}>
      <div className={styles.headline}>
        <Title tag={titleTag} looksLike={titleTagLooksLike ?? titleTag}>
          {title}
        </Title>
        {headlineExtraSlot}
      </div>
      {children}
    </section>
  );
};

export default UserListSection;
