import React from 'react';
import NotificationModal, { type NotificationModalProps } from '@/shared/ui/NotificationModal';
import NotificationIcon from '@/assets/icons/notification.svg?react';

export type SkillExchangeNotificationModalProps = Pick<
  NotificationModalProps,
  'isOpen' | 'onClickBtn'
>;

const SkillExchangeNotificationModal: React.FC<SkillExchangeNotificationModalProps> = (props) => {
  return (
    <NotificationModal
      {...props}
      title="Вы предложили обмен"
      description="Теперь дождитесь подтверждения. Вам придёт уведомление"
      icon={NotificationIcon}
    />
  );
};

export default SkillExchangeNotificationModal;
