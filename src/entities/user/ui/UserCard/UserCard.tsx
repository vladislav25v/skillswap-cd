import Avatar from '@/shared/ui/Avatar';
import Button from '@/shared/ui/Button/Button';
import { FavoriteButton } from '@/shared/ui/FavoriteButton';
import { SkillsTags, type SkillTagItem } from '@/shared/ui/Skilltags';
import { declension } from '@/shared/lib/declension/declension';
import styles from './UserCard.module.css';

export interface UserCardProps {
  name: string;
  city: string;
  age: number;
  avatarSrc?: string | null;
  isFavorite?: boolean;
  teachingSkills: SkillTagItem[];
  learningSkills: SkillTagItem[];
  detailsButtonText?: string;
  onFavoriteClick?: () => void;
  onDetailsClick?: () => void;
  className?: string;
}

export default function UserCard({
  name,
  city,
  age,
  avatarSrc,
  isFavorite = false,
  teachingSkills,
  learningSkills,
  detailsButtonText = 'Подробнее',
  onFavoriteClick,
  onDetailsClick,
  className = '',
}: UserCardProps) {
  const ageText = declension(age, ['год', 'года', 'лет']);

  return (
    <article className={`${styles.card} ${className}`.trim()}>
      <div className={styles.header}>
        <div className={styles.userInfo}>
          <Avatar src={avatarSrc} alt={name} size="medium" className={styles.avatar} />

          <div className={styles.meta}>
            <h2 className={styles.name}>{name}</h2>
            <p className={styles.location}>
              {city}, {age} {ageText}
            </p>
          </div>
        </div>

        <FavoriteButton
          isActive={isFavorite}
          onClick={onFavoriteClick}
          className={styles.favoriteButton}
        />
      </div>

      <SkillsTags
        teachingSkills={teachingSkills}
        learningSkills={learningSkills}
        maxVisibleTags={2}
        className={styles.skills}
      />

      <Button variant="primary" onClick={onDetailsClick} className={styles.detailsButton}>
        {detailsButtonText}
      </Button>
    </article>
  );
}
