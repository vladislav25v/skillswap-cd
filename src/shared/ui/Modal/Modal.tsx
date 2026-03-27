import { useEffect } from 'react';
import clsx from 'clsx';
import styles from './Modal.module.css';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  className?: string;
  overlayClassName?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className,
  overlayClassName,
}) => {
  const modalRoot = document.getElementById('modal-root') as HTMLElement;
  // Закрытие по нажатию вне компонента
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).id === 'overlay-background') {
      onClose();
    }
  };

  // Обработчик клавиш, для закрытия по Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Блокировка скролла body при открытом модальном окне
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      id="overlay-background"
      onClick={handleOutsideClick}
      className={clsx(styles.overlay, overlayClassName)}
    >
      <div className={clsx(styles.modal, className)}>
        {/* Кнопка закрытия */}
        <button
          type="button"
          onClick={onClose}
          className={styles.modalButton}
          aria-label="Закрыть модальное окно"
        >
          <X size={24} />
        </button>

        {/* Вставляем внутрь любые компоненты */}
        {children}
      </div>
    </div>,
    modalRoot,
  );
};

export default Modal;
