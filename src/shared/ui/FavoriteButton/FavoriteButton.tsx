import { Heart } from 'lucide-react';
import clsx from 'clsx';
import styles from './FavoriteButton.module.css';

interface FavoriteButtonProps {
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
}

export default function FavoriteButton({
  isActive = false,
  onClick,
  className,
  ariaLabel = 'Добавить в избранное',
}: FavoriteButtonProps) {
  return (
    <button
      type="button"
      className={clsx(
        styles.button,
        {
          [styles.active]: isActive,
          [styles.default]: !isActive,
        },
        className,
      )}
      onClick={onClick}
      aria-label={isActive ? 'Удалить из избранного' : ariaLabel}
      aria-pressed={isActive}
    >
      <Heart className={styles.icon} />
    </button>
  );
}
