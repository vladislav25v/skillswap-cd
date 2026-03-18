import { RectangleEllipsis, Share2 } from 'lucide-react';
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
  imageAlt,
  actions,
  showFavoriteButton = false,
  showTopActions = false,
  isFavorite = false,
  onFavoriteClick,
  className,
}: SkillDetailsPanelProps) {
  const hasHeader = Boolean(headerTitle || headerDescription);
  const hasToolbar = showFavoriteButton || showTopActions;

  return (
    <div className={[styles.panelShell, className].filter(Boolean).join(' ')}>
      <section className={styles.panel}>
        {hasHeader && (
          <header className={styles.header}>
            {headerTitle && <h2 className={styles.headerTitle}>{headerTitle}</h2>}
            {headerDescription && <p className={styles.headerDescription}>{headerDescription}</p>}
          </header>
        )}

        {hasToolbar && (
          <div className={styles.toolbar}>
            {showFavoriteButton && (
              <FavoriteButton
                className={styles.favoriteButton}
                isActive={isFavorite}
                onClick={onFavoriteClick}
                ariaLabel={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
              />
            )}
            {showTopActions && (
              <div className={styles.topActions}>
                <button type="button" aria-label="Поделиться">
                  <Share2 />
                </button>
                <button type="button" aria-label="Еще действия">
                  <RectangleEllipsis />
                </button>
              </div>
            )}
          </div>
        )}

        <div className={styles.content}>
          <div className={styles.textBlock}>
            <h1 className={styles.title}>{title}</h1>
            {meta && <p className={styles.meta}>{meta}</p>}
            {description && <p className={styles.description}>{description}</p>}
          </div>

          <div className={styles.media}>
            <SkillImageGallery images={images} imageAlt={imageAlt} />
          </div>

          {actions && <div className={styles.actions}>{actions}</div>}
        </div>
      </section>
    </div>
  );
}
