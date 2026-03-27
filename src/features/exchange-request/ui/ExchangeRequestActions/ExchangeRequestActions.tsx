import { useState } from 'react';
import { updateExchangeRequest } from '@/api';
import { useAuth } from '@/app/providers/auth-context';
import type { ExchangeRequest } from '@/entities/exchange-request';
import { canUserRespondToExchange } from '@/entities/exchange-request';
import Button from '@/shared/ui/Button/Button';
import styles from './ExchangeRequestActions.module.css';

interface ExchangeRequestActionsProps {
  exchangeRequest: ExchangeRequest;
  className?: string;
  onUpdated?: () => void | Promise<void>;
}

export const ExchangeRequestActions = ({
  exchangeRequest,
  className,
  onUpdated,
}: ExchangeRequestActionsProps) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!canUserRespondToExchange(exchangeRequest, user?.id)) {
    return null;
  }

  const handleUpdateStatus = async (status: 'in_progress' | 'rejected') => {
    setIsSubmitting(true);

    try {
      await updateExchangeRequest(exchangeRequest.id, {
        status,
        respondedAt: new Date().toISOString(),
      });

      await onUpdated?.();

      if (status === 'rejected') {
        window.alert('Заявка отклонена.');
      }
    } catch {
      window.alert('Не удалось обновить статус заявки.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`${styles.actions} ${className ?? ''}`.trim()}>
      <Button
        variant="primary"
        disabled={isSubmitting}
        onClick={() => {
          void handleUpdateStatus('in_progress');
        }}
      >
        Принять
      </Button>
      <Button
        variant="secondary"
        disabled={isSubmitting}
        onClick={() => {
          void handleUpdateStatus('rejected');
        }}
      >
        Отклонить
      </Button>
    </div>
  );
};
