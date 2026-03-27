import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSkills, getUserExchanges, getUsers } from '@/api';
import { useAuth } from '@/app/providers/auth-context';
import { getExchangeStatusLabel } from '@/entities/exchange-request';
import type { ExchangeRequest, ExchangeRequestStatus } from '@/entities/exchange-request';
import type { Skill } from '@/entities/skill/types';
import type { User } from '@/entities/user/types';
import { CompleteExchangeButton } from '@/features/exchange-request';
import { SectionBlock } from '@/widgets/SectionBlock';
import styles from '@/widgets/ProfileRequests/ProfileRequests.module.css';

export interface ProfileExchangesProps {
  className?: string;
}

type ExchangeCardViewModel = {
  exchangeRequest: ExchangeRequest;
  skillTitle: string;
  skillId: number | null;
  partnerName: string;
  createdAtLabel: string;
  statusLabel: string;
};

const STATUS_CLASS_BY_VALUE: Record<ExchangeRequestStatus, string> = {
  pending: styles.statusPending,
  in_progress: styles.statusInProgress,
  completed: styles.statusCompleted,
  rejected: styles.statusRejected,
};

const formatDate = (value: string): string => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Дата неизвестна';
  }

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

const buildExchangeCardViewModel = ({
  currentUserId,
  exchangeRequest,
  skills,
  users,
}: {
  currentUserId: number;
  exchangeRequest: ExchangeRequest;
  skills: Skill[];
  users: User[];
}): ExchangeCardViewModel => {
  const skill = skills.find((item) => item.id === exchangeRequest.skillId);
  const partnerId =
    exchangeRequest.ownerUserId === currentUserId
      ? exchangeRequest.requesterUserId
      : exchangeRequest.ownerUserId;
  const partnerName = users.find((item) => item.id === partnerId)?.name ?? 'Пользователь не найден';

  return {
    exchangeRequest,
    skillTitle: skill?.title ?? 'Навык недоступен',
    skillId: skill?.id ?? null,
    partnerName,
    createdAtLabel: formatDate(exchangeRequest.createdAt),
    statusLabel: getExchangeStatusLabel(exchangeRequest.status),
  };
};

const ProfileExchanges: React.FC<ProfileExchangesProps> = ({ className }) => {
  const { user } = useAuth();
  const [exchanges, setExchanges] = useState<ExchangeRequest[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadExchanges = useCallback(async () => {
    if (!user) {
      setExchanges([]);
      setSkills([]);
      setUsers([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const [exchangesData, skillsData, usersData] = await Promise.all([
        getUserExchanges(user.id),
        getSkills(),
        getUsers(),
      ]);

      setExchanges(exchangesData);
      setSkills(skillsData);
      setUsers(usersData);
    } catch {
      setErrorMessage('Не удалось загрузить ваши обмены.');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void loadExchanges();
  }, [loadExchanges]);

  const activeCards = useMemo(() => {
    if (!user) {
      return [];
    }

    return exchanges
      .filter((exchangeRequest) => exchangeRequest.status === 'in_progress')
      .map((exchangeRequest) =>
        buildExchangeCardViewModel({
          currentUserId: user.id,
          exchangeRequest,
          skills,
          users,
        }),
      );
  }, [exchanges, skills, user, users]);

  const completedCards = useMemo(() => {
    if (!user) {
      return [];
    }

    return exchanges
      .filter((exchangeRequest) => exchangeRequest.status === 'completed')
      .map((exchangeRequest) =>
        buildExchangeCardViewModel({
          currentUserId: user.id,
          exchangeRequest,
          skills,
          users,
        }),
      );
  }, [exchanges, skills, user, users]);

  if (isLoading) {
    return (
      <SectionBlock className={className}>
        <p className={styles.infoState}>Загрузка обменов...</p>
      </SectionBlock>
    );
  }

  if (errorMessage) {
    return (
      <SectionBlock className={className}>
        <p className={styles.infoState}>{errorMessage}</p>
      </SectionBlock>
    );
  }

  if (!user) {
    return (
      <SectionBlock className={className}>
        <p className={styles.infoState}>Пользователь не авторизован.</p>
      </SectionBlock>
    );
  }

  const hasExchanges = activeCards.length > 0 || completedCards.length > 0;

  return (
    <div className={styles.page}>
      {!hasExchanges && (
        <SectionBlock className={className}>
          <p className={styles.emptyState}>У вас пока нет активных обменов.</p>
        </SectionBlock>
      )}

      {activeCards.length > 0 && (
        <SectionBlock className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Активные обмены</h2>
            <span className={styles.sectionCount}>{activeCards.length}</span>
          </div>

          <div className={styles.cards}>
            {activeCards.map((card) => (
              <article key={card.exchangeRequest.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <div className={styles.cardTitleWrap}>
                    {card.skillId ? (
                      <Link to={`/skill/${card.skillId}`} className={styles.cardLink}>
                        <h3 className={styles.cardTitle}>{card.skillTitle}</h3>
                      </Link>
                    ) : (
                      <h3 className={styles.cardTitle}>{card.skillTitle}</h3>
                    )}

                    <p className={styles.cardMeta}>
                      <span>С участником: {card.partnerName}</span>
                      <span>Создана: {card.createdAtLabel}</span>
                    </p>
                  </div>

                  <span
                    className={`${styles.status} ${STATUS_CLASS_BY_VALUE[card.exchangeRequest.status]}`}
                  >
                    {card.statusLabel}
                  </span>
                </div>

                <p className={styles.cardDescription}>
                  Обмен по навыку «{card.skillTitle}» уже начался.
                </p>

                <div className={styles.actions}>
                  <CompleteExchangeButton
                    exchangeRequest={card.exchangeRequest}
                    onCompleted={loadExchanges}
                  />
                </div>
              </article>
            ))}
          </div>
        </SectionBlock>
      )}

      {completedCards.length > 0 && (
        <SectionBlock className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Завершенные обмены</h2>
            <span className={styles.sectionCount}>{completedCards.length}</span>
          </div>

          <div className={styles.cards}>
            {completedCards.map((card) => (
              <article key={card.exchangeRequest.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <div className={styles.cardTitleWrap}>
                    {card.skillId ? (
                      <Link to={`/skill/${card.skillId}`} className={styles.cardLink}>
                        <h3 className={styles.cardTitle}>{card.skillTitle}</h3>
                      </Link>
                    ) : (
                      <h3 className={styles.cardTitle}>{card.skillTitle}</h3>
                    )}

                    <p className={styles.cardMeta}>
                      <span>С участником: {card.partnerName}</span>
                      <span>Создана: {card.createdAtLabel}</span>
                    </p>
                  </div>

                  <span
                    className={`${styles.status} ${STATUS_CLASS_BY_VALUE[card.exchangeRequest.status]}`}
                  >
                    {card.statusLabel}
                  </span>
                </div>

                <p className={styles.cardDescription}>
                  Обмен по навыку «{card.skillTitle}» завершен.
                </p>
              </article>
            ))}
          </div>
        </SectionBlock>
      )}
    </div>
  );
};

export default ProfileExchanges;
