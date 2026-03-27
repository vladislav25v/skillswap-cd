import React from 'react';
import { SkillDetailsPanel } from '@/widgets/SkillDetailsPanel';
import Modal from '@/shared/ui/Modal';
import Title from '@/shared/ui/Title';
import Button from '@/shared/ui/Button/Button.tsx';
import { PencilLine } from 'lucide-react';
import styles from './RegApproveSkillModal.module.css';
import type { SkillFormDataToApprove } from '@/widgets/RegStep3Form';

export interface RegApproveSkillModalProps {
  isOpen: boolean;
  data: SkillFormDataToApprove;
  onBack: () => void;
  onApprove: () => void;
}

const RegApproveSkillModal: React.FC<RegApproveSkillModalProps> = ({
  isOpen,
  data,
  onBack,
  onApprove,
}) => {
  return (
    <Modal className={styles.modal} isOpen={isOpen} hasCloseButton={false} onClose={() => {}}>
      <div className={styles.header}>
        <Title tag="h2">Ваше предложение</Title>
        <p className={styles.subtitle}>Пожалуйста, проверьте и подтвердите правильность данных</p>
      </div>

      <SkillDetailsPanel
        title={data.name}
        description={data.description}
        images={data.pictures.map((picture) => URL.createObjectURL(picture))}
        meta={`${data.categoryName} / ${data.subcategoryName}`}
        panelClassName={styles.panel}
        contentClassName={styles.content}
        actions={
          <>
            <Button variant="secondary" onClick={onBack}>
              Редактировать <PencilLine />
            </Button>
            <Button onClick={onApprove}>Готов</Button>
          </>
        }
      />
    </Modal>
  );
};

export default RegApproveSkillModal;
