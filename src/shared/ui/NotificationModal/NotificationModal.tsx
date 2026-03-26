import React from 'react';
import clsx from 'clsx';
import styles from './NotificationModal.module.css';
import Title from '@/shared/ui/Title';
import Button from '@/shared/ui/Button/Button.tsx';
import Modal from '@/shared/ui/Modal';

export interface NotificationModalProps {
  isOpen: boolean;
  title: string;
  description?: string;
  className?: string;
  icon?: React.FunctionComponent<React.ComponentProps<'svg'>>;
  onClickBtn?: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  title,
  description,
  className,
  icon,
  onClickBtn,
}) => {
  const Icon = icon;

  const handleClickBtn = () => {
    if (onClickBtn) {
      onClickBtn();
    }
  };

  return (
    <Modal
      className={clsx(styles.modal, className)}
      isOpen={isOpen}
      hasCloseButton={false}
      onClose={() => {}}
    >
      {Icon && <div className={styles.iconHolder}>{<Icon className={styles.icon} />}</div>}
      <div className={styles.content}>
        <Title tag="h2">{title}</Title>
        {description && <p className={styles.description}>{description}</p>}
      </div>
      <Button className={styles.button} onClick={handleClickBtn}>
        Готово
      </Button>
    </Modal>
  );
};

export default NotificationModal;
