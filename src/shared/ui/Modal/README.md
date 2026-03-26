# Компонент Modal
Компонент Modal — это универсальный модальный диалог, который отображается поверх основного контента и позволяет показывать пользователю дополнительную информацию или формы. Он реализован с возможностью открытия и закрытия по различным действиям, таким как клик вне окна или нажатие клавиши Escape.
## Modal.tsx
- interface ModalProps:
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode; // чтобы можно было вставлять любые React компоненты
  hasCloseButton; // отображать иконку закрытия

- Управление отображением: 
  Модальное окно отображается, когда проп isOpen равен true, и скрывается — при false. При открытии (isOpen = true) компонент рендерит разметку с затемнённым фоном (overlay) и модальным окном (modal).
- Закрытие:
  В верхнем правом углу расположена кнопка с иконкой X (используя компонент lucide-react), по клику на которую вызывается функция onClose.  
  По клику на затемнённую область (overlay) вне содержимого окна. Обработчик handleOutsideClick закрывает окно, если клик был сделан вне содержимого (id="overlay-background").  
  По нажатию клавиши Escape. В useEffect добавляется слушатель клавиши keydown, который закрывает окно по нажатию Escape. При закрытии слушатель удаляется для предотвращения утечек памяти.
## Modal.module.css
- overlay (стилизация оверлея)
- modal (стилизация модального окна)
- modalButton (стилизация кнопки закрытия модального окна)

Для проверки компонента визуально можно вставить в компонент App.tsx:
- Импорты: 
  import { Modal } from './shared/ui/Modal';
  import { useState } from 'react';

- Перед return:
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

- В разметку добавить компонент с кнопкой для его открытия:
  <button onClick={openModal}>Открыть модальное окно</button>
  <Modal isOpen={isModalOpen} onClose={closeModal}>
    <div>
      <h2>Заголовок модального окна</h2>
      <p>Пример содержимого внутри модалки.</p>
    </div>
  </Modal>
