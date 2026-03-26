import styles from './SkillPicturesPicker.module.css';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import SkillPicturesPickerPreviews from './components/SkillPicturesPickerPreviews';
import { ImagePlus } from 'lucide-react';

export interface SkillPicturesPickerProps {
  className?: string;
  onFilesChange: (files: File[]) => void;
}

const SkillPicturesPicker: React.FC<SkillPicturesPickerProps> = ({ className, onFilesChange }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputFileRef = useRef<HTMLInputElement | null>(null);

  const previews = useMemo(() => {
    return files.map((file) => URL.createObjectURL(file));
  }, [files]);

  useEffect(() => {
    onFilesChange(files);
  }, [files, onFilesChange]);

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  useEffect(() => {
    const handleWindowDrop = (evt: DragEvent) => {
      const hasFiles = [...(evt.dataTransfer?.items ?? [])].some((item) => item.kind === 'file');

      if (hasFiles) {
        evt.preventDefault();
      }
    };

    window.addEventListener('drop', handleWindowDrop);

    return () => {
      window.removeEventListener('drop', handleWindowDrop);
    };
  }, []);

  const handleClickUploadBtn = () => {
    inputFileRef.current?.click();
  };

  const onClearPreviews = () => {
    setFiles([]);

    if (inputFileRef.current) {
      inputFileRef.current.value = '';
    }
  };

  const handleChaneInputFile = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(evt.target?.files ?? []);

    setFiles((oldFiles) => [...oldFiles, ...newFiles]);
  };

  const handleDragOver = (evt: React.DragEvent<HTMLLabelElement>) => {
    evt.preventDefault();
  };

  const handleDragEnter = (evt: React.DragEvent<HTMLLabelElement>) => {
    evt.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (evt: React.DragEvent<HTMLLabelElement>) => {
    evt.preventDefault();
    const currentTarget = evt.currentTarget;
    const relatedTarget = evt.relatedTarget as HTMLElement;

    if (currentTarget.contains(relatedTarget)) return;

    setIsDragging(false);
  };

  const handleDrop = (evt: React.DragEvent<HTMLLabelElement>) => {
    evt.preventDefault();
    setIsDragging(false);

    const newFiles: File[] = [];

    for (const item of evt.dataTransfer?.items ?? []) {
      if (item.kind === 'file' && item.type.startsWith('image/')) {
        const file = item.getAsFile();

        if (file) {
          newFiles.push(file);
        }
      }
    }

    if (newFiles.length > 0) {
      setFiles((oldFiles) => [...oldFiles, ...newFiles]);
    }
  };

  return (
    <div className={clsx(styles.container, className)}>
      <label
        className={clsx(styles.dropZone, isDragging && styles.dropZoneDragging)}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={inputFileRef}
          className={styles.input}
          type="file"
          accept="image/*"
          multiple
          onChange={handleChaneInputFile}
        />
        <span>Перетащите или выберите изображения навыка</span>
        <button className={styles.uploadBtn} type={'button'} onClick={handleClickUploadBtn}>
          <ImagePlus />
          Выбрать изображения
        </button>
      </label>

      {previews.length > 0 && (
        <SkillPicturesPickerPreviews previews={previews} onClear={onClearPreviews} />
      )}
    </div>
  );
};

export default SkillPicturesPicker;
