import { useState } from 'react';
import { updateExchangeRequest } from '@/api';
import { useAuth } from '@/app/providers/auth-context';
import type { ExchangeRequest } from '@/entities/exchange-request';
import { canUserCompleteExchange } from '@/entities/exchange-request';
import Button from '@/shared/ui/Button/Button';

interface CompleteExchangeButtonProps {
  exchangeRequest: ExchangeRequest;
  className?: string;
  onCompleted?: () => void | Promise<void>;
}

export const CompleteExchangeButton = ({
  exchangeRequest,
  className,
  onCompleted,
}: CompleteExchangeButtonProps) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!canUserCompleteExchange(exchangeRequest, user?.id)) {
    return null;
  }

  const handleClick = async () => {
    setIsSubmitting(true);

    try {
      await updateExchangeRequest(exchangeRequest.id, {
        status: 'completed',
        completedAt: new Date().toISOString(),
      });

      await onCompleted?.();
      window.alert('Обмен завершен.');
    } catch {
      window.alert('Не удалось завершить обмен.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Button variant="primary" className={className} disabled={isSubmitting} onClick={handleClick}>
      {isSubmitting ? 'Завершение...' : 'Завершить'}
    </Button>
  );
};
