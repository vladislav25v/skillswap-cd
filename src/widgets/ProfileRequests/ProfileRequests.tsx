import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getIncomingExchangeRequests,
  getOutgoingExchangeRequests,
  getSkills,
  getUsers,
} from '@/api';
import { useAuth } from '@/app/providers/auth-context';
import { getExchangeStatusLabel } from '@/entities/exchange-request';
import type { ExchangeRequest, ExchangeRequestStatus } from '@/entities/exchange-request';
import type { Skill } from '@/entities/skill/types';
import type { User } from '@/entities/user/types';
import { CompleteExchangeButton, ExchangeRequestActions } from '@/features/exchange-request';
import { SectionBlock } from '@/widgets/SectionBlock';
import styles from './ProfileRequests.module.css';

export interface ProfileRequestsProps {
  className?: string;
}

type ExchangeRequestCardViewModel = {
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

const getPartnerName = ({
  exchangeRequest,
  users,
  currentUserId,
}: {
  exchangeRequest: ExchangeRequest;
  users: User[];
  currentUserId: number;
}): string => {
  const partnerId =
    exchangeRequest.ownerUserId === currentUserId
      ? exchangeRequest.requesterUserId
      : exchangeRequest.ownerUserId;

  return users.find((user) => user.id === partnerId)?.name ?? 'Пользователь не найден';
};

const buildExchangeRequestCardViewModel = ({
  exchangeRequest,
  currentUserId,
  skills,
  users,
}: {
  exchangeRequest: ExchangeRequest;
  currentUserId: number;
  skills: Skill[];
  users: User[];
}): ExchangeRequestCardViewModel => {
  const skill = skills.find((item) => item.id === exchangeRequest.skillId);

  return {
    exchangeRequest,
    skillTitle: skill?.title ?? 'Навык недоступен',
    skillId: skill?.id ?? null,
    partnerName: getPartnerName({
      exchangeRequest,
      users,
      currentUserId,
    }),
    createdAtLabel: formatDate(exchangeRequest.createdAt),
    statusLabel: getExchangeStatusLabel(exchangeRequest.status),
  };
};

const renderActions = (
  exchangeRequest: ExchangeRequest,
  onUpdated: () => Promise<void>,
): React.ReactNode => (
  <div className={styles.actions}>
    <ExchangeRequestActions exchangeRequest={exchangeRequest} onUpdated={onUpdated} />
    <CompleteExchangeButton exchangeRequest={exchangeRequest} onCompleted={onUpdated} />
  </div>
);

const ProfileRequests: React.FC<ProfileRequestsProps> = ({ className }) => {
  const { user } = useAuth();
  const [incomingRequests, setIncomingRequests] = useState<ExchangeRequest[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<ExchangeRequest[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadRequests = useCallback(async () => {
    if (!user) {
      setIncomingRequests([]);
      setOutgoingRequests([]);
      setSkills([]);
      setUsers([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const [incomingData, outgoingData, skillsData, usersData] = await Promise.all([
        getIncomingExchangeRequests(user.id),
        getOutgoingExchangeRequests(user.id),
        getSkills(),
        getUsers(),
      ]);

      setIncomingRequests(incomingData);
      setOutgoingRequests(outgoingData);
      setSkills(skillsData);
      setUsers(usersData);
    } catch {
      setErrorMessage('Не удалось загрузить заявки на обмен.');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void loadRequests();
  }, [loadRequests]);

  const incomingCards = useMemo(() => {
    if (!user) {
      return [];
    }

    return incomingRequests
      .filter((exchangeRequest) => exchangeRequest.status === 'pending')
      .map((exchangeRequest) =>
        buildExchangeRequestCardViewModel({
          exchangeRequest,
          currentUserId: user.id,
          skills,
          users,
        }),
      );
  }, [incomingRequests, skills, user, users]);

  const outgoingCards = useMemo(() => {
    if (!user) {
      return [];
    }

    return outgoingRequests
      .filter((exchangeRequest) => exchangeRequest.status === 'pending')
      .map((exchangeRequest) =>
        buildExchangeRequestCardViewModel({
          exchangeRequest,
          currentUserId: user.id,
          skills,
          users,
        }),
      );
  }, [outgoingRequests, skills, user, users]);

  if (isLoading) {
    return (
      <SectionBlock className={className}>
        <p className={styles.infoState}>Загрузка заявок на обмен...</p>
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

  const hasRequests = incomingCards.length > 0 || outgoingCards.length > 0;

  return (
    <div className={styles.page}>
      {!hasRequests && (
        <SectionBlock className={className}>
          <p className={styles.emptyState}>У вас пока нет заявок на обмен.</p>
        </SectionBlock>
      )}

      {incomingCards.length > 0 && (
        <SectionBlock className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Входящие заявки</h2>
            <span className={styles.sectionCount}>{incomingCards.length}</span>
          </div>

          <div className={styles.cards}>
            {incomingCards.map((card) => (
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
                      <span>От: {card.partnerName}</span>
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
                  Пользователь хочет предложить вам обмен по навыку «{card.skillTitle}».
                </p>

                {renderActions(card.exchangeRequest, loadRequests)}
              </article>
            ))}
          </div>
        </SectionBlock>
      )}

      {outgoingCards.length > 0 && (
        <SectionBlock className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Исходящие заявки</h2>
            <span className={styles.sectionCount}>{outgoingCards.length}</span>
          </div>

          <div className={styles.cards}>
            {outgoingCards.map((card) => (
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
                      <span>Кому: {card.partnerName}</span>
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
                  Вы отправили заявку на обмен по навыку «{card.skillTitle}».
                </p>

                {renderActions(card.exchangeRequest, loadRequests)}
              </article>
            ))}
          </div>
        </SectionBlock>
      )}
    </div>
  );
};

export default ProfileRequests;
