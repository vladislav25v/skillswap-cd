import { Heart } from 'lucide-react';
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
  className = '',
  ariaLabel = 'Добавить в избранное',
}: FavoriteButtonProps) {
  return (
    <button
      type="button"
      className={`${styles.button} ${isActive ? styles.active : styles.default} ${className}`.trim()}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={isActive}
    >
      <Heart className={styles.icon} />
    </button>
  );
}