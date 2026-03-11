import { useEffect } from 'react';
import styles from './Modal.module.css';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode; // чтобы можно было вставлять любые React компоненты
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
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
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div id="overlay-background" onClick={handleOutsideClick} className={styles.overlay}>
      <div className={styles.modal}>
        {/* Кнопка закрытия */}
        <button type="button" onClick={onClose} className={styles.modalButton}>
          <X size={24} />
        </button>

        {/* Вставляем внутрь любые компоненты */}
        {children}
      </div>
    </div>
  );
};

export default Modal;
