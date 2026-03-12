import { FavoriteButton } from '@/shared/ui/FavoriteButton';
import SkillImageGallery from '@/widgets/SkillDetailsPanel/ui/SkillImageGallery.tsx';
import styles from './SkillDetailsPanel.module.css';
import type { SkillDetailsPanelProps } from './types.ts';

export default function SkillDetailsPanel({
  headerTitle,
  headerDescription,
  title,
  meta,
  description,
  images,
  actions,
  showFavoriteButton = false,
  isFavorite = false,
  onFavoriteClick,
  topActions,
  className,
}: SkillDetailsPanelProps) {
  const hasHeader = Boolean(headerTitle || headerDescription);

  return (
    <section className={[styles.panel, className].filter(Boolean).join(' ')}>
      {hasHeader && (
        <header className={styles.header}>
          {headerTitle && <h2 className={styles.headerTitle}>{headerTitle}</h2>}
          {headerDescription && <p className={styles.headerDescription}>{headerDescription}</p>}
        </header>
      )}

      <div className={styles.content}>
        <div className={styles.info}>
          <h1 className={styles.title}>{title}</h1>
          {meta && <p className={styles.meta}>{meta}</p>}
          {description && <p className={styles.description}>{description}</p>}
          {actions && <div className={styles.actions}>{actions}</div>}
        </div>

        <div className={styles.media}>
          <div className={styles.toolbar}>
            {showFavoriteButton && (
              <FavoriteButton
                isActive={isFavorite}
                onClick={onFavoriteClick}
                ariaLabel={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
              />
            )}
            {topActions && <div className={styles.topActions}>{topActions}</div>}
          </div>

          <SkillImageGallery images={images} />
        </div>
      </div>
    </section>
  );
}
