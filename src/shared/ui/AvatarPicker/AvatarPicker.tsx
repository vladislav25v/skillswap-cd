import Avatar, { type AvatarProps } from '@/shared/ui/Avatar';
import styles from './AvatarPicker.module.css';
import { useAvatarFilePicker } from '@/shared/hooks/useAvatarFilePicker.ts';
import React, { useRef } from 'react';
import clsx from 'clsx';

export type AvatarPickerProps = AvatarProps & {
  value?: string;
  placeholder?: string;
  onChangeFile?: (file: File | null) => void;
  triggerSlot?: React.ReactNode;
};

const AvatarPicker: React.FC<AvatarPickerProps> = ({
  value,
  placeholder,
  size,
  onChangeFile,
  className,
  triggerSlot,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { preview, onChange } = useAvatarFilePicker();

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }

    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e);

    if (onChangeFile) {
      onChangeFile(e.target.files?.[0] ?? null);
    }
  };

  return (
    <div className={clsx(styles.avatarPicker, className)}>
      <Avatar className={styles.avatar} src={value ?? preview ?? placeholder} size={size} />
      <input
        ref={inputRef}
        className={styles.input}
        id={'avatar-input'}
        name={'avatar-input'}
        type="file"
        onChange={handleChange}
        accept="image/*"
      />

      {triggerSlot && (
        <div
          className={styles.triggerHolder}
          aria-controls={'avatar-input'}
          onClick={handleClick}
          aria-label={'Выбрать файл'}
        >
          {triggerSlot}
        </div>
      )}
    </div>
  );
};

export default AvatarPicker;
