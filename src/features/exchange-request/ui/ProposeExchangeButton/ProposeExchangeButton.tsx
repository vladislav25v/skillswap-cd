import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createExchangeRequest, getExchangeRequests } from '@/api';
import { useAuth } from '@/app/providers/auth-context';
import Button from '@/shared/ui/Button/Button';
import { hasActiveExchangeDuplicate } from '@/features/exchange-request/lib/hasActiveExchangeDuplicate';
import styles from './ProposeExchangeButton.module.css';

interface ProposeExchangeButtonProps {
  skillId: number;
  ownerUserId: number;
  className?: string;
  onCreated?: () => void | Promise<void>;
}

export const ProposeExchangeButton = ({
  skillId,
  ownerUserId,
  className,
  onCreated,
}: ProposeExchangeButtonProps) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClick = async () => {
    if (!isAuthenticated || !user) {
      navigate('/login', {
        state: {
          from: location.pathname,
        },
      });
      return;
    }

    if (user.id === ownerUserId) {
      window.alert('Нельзя отправить заявку на обмен самому себе.');
      return;
    }

    setIsSubmitting(true);

    try {
      const exchangeRequests = await getExchangeRequests();
      const duplicateExists = hasActiveExchangeDuplicate({
        exchangeRequests,
        skillId,
        requesterUserId: user.id,
      });

      if (duplicateExists) {
        window.alert('Активная заявка на этот навык уже существует.');
        return;
      }

      await createExchangeRequest({
        skillId,
        ownerUserId,
        requesterUserId: user.id,
        status: 'pending',
        createdAt: new Date().toISOString(),
        respondedAt: null,
        completedAt: null,
      });

      await onCreated?.();
      window.alert('Заявка на обмен отправлена.');
    } catch {
      window.alert('Не удалось отправить заявку на обмен.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Button
      variant="primary"
      className={`${styles.button} ${className ?? ''}`.trim()}
      disabled={isSubmitting}
      onClick={handleClick}
    >
      {isSubmitting ? 'Отправка...' : 'Предложить обмен'}
    </Button>
  );
};
