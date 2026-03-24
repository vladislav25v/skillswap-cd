import React from 'react';
import styles from './SkillPicturesPickerPreviews.module.css';
import clsx from 'clsx';
import { Trash2 } from 'lucide-react';

export interface SkillPicturesPickerPreviewsProps {
  className?: string;
  previews: string[];
  onClear: () => void;
}

const SkillPicturesPickerPreviews: React.FC<SkillPicturesPickerPreviewsProps> = ({
  className,
  previews,
  onClear,
}) => {
  return (
    <div className={clsx(styles.previews, className)}>
      <ul className={styles.list}>
        {previews.map((preview, index) => {
          return (
            <li key={index} className={styles.item}>
              <img
                className={styles.image}
                src={preview}
                alt={`Изображение навыка, ${index + 1} из ${previews.length}`}
              />
            </li>
          );
        })}
      </ul>

      <button className={styles.clearBtn} type={'button'} onClick={onClear}>
        <Trash2 />
        Очистить
      </button>
    </div>
  );
};

export default SkillPicturesPickerPreviews;
