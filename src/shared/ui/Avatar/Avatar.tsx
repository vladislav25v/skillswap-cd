import React from 'react';
import clsx from 'clsx';
import styles from './Avatar.module.css';

export type AvatarSize = 'small' | 'medium' | 'large';

export interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: AvatarSize;
  className?: string;
}

const sizeMap: Record<AvatarSize, string> = {
  small: '44px',
  medium: '100px',
  large: '244px',
};

const Avatar: React.FC<AvatarProps> = ({ src, alt = '', size = 'medium', className }) => {
  const avatarSize = sizeMap[size];

  const getInitials = (name: string): string => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const initials = getInitials(alt);

  if (src) {
    return (
      <div
        className={clsx(styles.avatar, styles.photoWrapper, className)}
        style={{ width: avatarSize, height: avatarSize }}
        data-size={size}
      >
        <img src={src} alt={alt || 'avatar'} className={styles.photo} />
      </div>
    );
  }

  return (
    <div
      className={clsx(styles.avatar, styles.placeholder, className)}
      style={{ width: avatarSize, height: avatarSize }}
      role="img"
      aria-label={alt || 'avatar placeholder'}
      data-size={size}
    >
      <span className={styles.initials}>{initials}</span>
    </div>
  );
};

export default Avatar;
