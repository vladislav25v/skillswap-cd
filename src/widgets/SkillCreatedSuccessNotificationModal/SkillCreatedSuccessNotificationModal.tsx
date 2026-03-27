import React from 'react';
import NotificationModal, { type NotificationModalProps } from '@/shared/ui/NotificationModal';
import DoneIcon from '@/assets/icons/done.svg?react';

export type SkillCreatedSuccessNotificationModalProps = Pick<
  NotificationModalProps,
  'isOpen' | 'onClickBtn'
>;

const SkillCreatedSuccessNotificationModal: React.FC<SkillCreatedSuccessNotificationModalProps> = (
  props,
) => {
  return (
    <NotificationModal
      {...props}
      title="Ваше предложение создано"
      description="Теперь вы можете предложить обмен"
      icon={DoneIcon}
    />
  );
};

export default SkillCreatedSuccessNotificationModal;
