import { useEffect, useState } from 'react';
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
  const [hasDuplicateRequest, setHasDuplicateRequest] = useState(false);

  useEffect(() => {
    const loadDuplicateStatus = async () => {
      if (!isAuthenticated || !user || user.id === ownerUserId) {
        setHasDuplicateRequest(false);
        return;
      }

      try {
        const exchangeRequests = await getExchangeRequests();
        setHasDuplicateRequest(
          hasActiveExchangeDuplicate({
            exchangeRequests,
            skillId,
            requesterUserId: user.id,
          }),
        );
      } catch {
        setHasDuplicateRequest(false);
      }
    };

    void loadDuplicateStatus();
  }, [isAuthenticated, ownerUserId, skillId, user]);

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

    if (hasDuplicateRequest) {
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
        setHasDuplicateRequest(true);
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

      setHasDuplicateRequest(true);
      await onCreated?.();

      if (!onCreated) {
        window.alert('Заявка на обмен отправлена.');
      }
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
      disabled={isSubmitting || hasDuplicateRequest}
      onClick={handleClick}
    >
      {isSubmitting ? 'Отправка...' : hasDuplicateRequest ? 'Обмен предложен' : 'Предложить обмен'}
    </Button>
  );
};
