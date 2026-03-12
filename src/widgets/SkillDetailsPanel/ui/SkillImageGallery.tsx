import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import styles from './SkillImageGallery.module.css';

interface SkillImageGalleryProps {
  images: string[];
}

const MAX_VISIBLE_THUMBS = 3;

export default function SkillImageGallery({ images }: SkillImageGalleryProps) {
  const normalizedImages = images.filter(Boolean);
  const [activeIndex, setActiveIndex] = useState(0);

  if (normalizedImages.length === 0) {
    return null;
  }

  const activeImage = normalizedImages[activeIndex] ?? normalizedImages[0];
  const showNavigation = normalizedImages.length > 1;
  const thumbItems = normalizedImages.slice(
    0,
    Math.min(normalizedImages.length, MAX_VISIBLE_THUMBS),
  );
  const lastVisibleThumbIndex = thumbItems.length - 1;
  const hiddenCount = Math.max(normalizedImages.length - MAX_VISIBLE_THUMBS, 0);

  const handlePrevious = () => {
    setActiveIndex((currentIndex) =>
      currentIndex === 0 ? normalizedImages.length - 1 : currentIndex - 1,
    );
  };

  const handleNext = () => {
    setActiveIndex((currentIndex) =>
      currentIndex === normalizedImages.length - 1 ? 0 : currentIndex + 1,
    );
  };

  return (
    <div className={styles.gallery}>
      <div className={styles.mainImageWrapper}>
        <img className={styles.mainImage} src={activeImage} alt="" />

        {showNavigation && (
          <>
            <button
              type="button"
              className={`${styles.navButton} ${styles.navButtonLeft}`}
              onClick={handlePrevious}
              aria-label="Показать предыдущее изображение"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              className={`${styles.navButton} ${styles.navButtonRight}`}
              onClick={handleNext}
              aria-label="Показать следующее изображение"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {normalizedImages.length > 1 && (
        <div className={styles.thumbs}>
          {thumbItems.map((image, index) => {
            const isActive = index === activeIndex;
            const showOverlay = hiddenCount > 0 && index === lastVisibleThumbIndex;

            return (
              <button
                key={`${image}-${index}`}
                type="button"
                className={`${styles.thumbButton} ${isActive ? styles.thumbButtonActive : ''}`.trim()}
                onClick={() => setActiveIndex(index)}
                aria-label={`Показать изображение ${index + 1}`}
                aria-pressed={isActive}
              >
                <img className={styles.thumbImage} src={image} alt="" />
                {showOverlay && <span className={styles.thumbOverlay}>+{hiddenCount}</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
