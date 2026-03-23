import React from 'react';
import styles from './AuthInfoCard.module.css';
import clsx from 'clsx';
import Title from '@/shared/ui/Title';

export interface AuthInfoCardProps {
  className?: string;
  picture?: string;
  pictureAlt?: string;
  title?: string;
  text?: string;
}

const AuthInfoCard: React.FC<AuthInfoCardProps> = ({
  className,
  picture,
  pictureAlt,
  title,
  text,
}) => {
  return (
    <div className={clsx(styles.authInfoCard, className)}>
      {picture && (
        <div className={styles.pictureWrapper}>
          <img className={styles.picture} src={picture} alt={pictureAlt} />
        </div>
      )}

      <div className={styles.content}>
        {title && <Title tag={'h2'}>{title}</Title>}
        {text && <p className={styles.description}>{text}</p>}
      </div>
    </div>
  );
};

export default AuthInfoCard;
