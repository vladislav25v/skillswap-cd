import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  getCategories,
  getCities,
  getSkillById,
  getSkills,
  getSubcategories,
  getUsers,
} from '@/api';
import { mapSkillToPageViewModel } from '@/entities/skill/lib/map-skill-to-page-view-model';
import type { SkillPageViewModel } from '@/entities/skill/view-model';
import { UserCard } from '@/entities/user/ui/UserCard';
import { ProposeExchangeButton } from '@/features/exchange-request';
import { SectionBlock } from '@/widgets/SectionBlock';
import { SkillDetailsPanel } from '@/widgets/SkillDetailsPanel';
import UsersListSection from '@/widgets/UsersListSection';
import styles from './SkillPage.module.css';

export const SkillPage = () => {
  const { skillId } = useParams();
  const [pageViewModel, setPageViewModel] = useState<SkillPageViewModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const normalizedSkillId = Number(skillId);

    if (!normalizedSkillId) {
      setPageViewModel(null);
      setErrorMessage('Некорректный идентификатор навыка.');
      setIsLoading(false);
      return;
    }

    const loadSkillPage = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const [skill, skills, users, cities, subcategories, categories] = await Promise.all([
          getSkillById(normalizedSkillId),
          getSkills(),
          getUsers(),
          getCities(),
          getSubcategories(),
          getCategories(),
        ]);

        if (!skill) {
          setPageViewModel(null);
          setErrorMessage('Навык не найден.');
          return;
        }

        const nextPageViewModel = mapSkillToPageViewModel({
          skill,
          skills,
          users,
          cities,
          subcategories,
          categories,
        });

        if (!nextPageViewModel) {
          setPageViewModel(null);
          setErrorMessage('Не удалось собрать данные страницы навыка.');
          return;
        }

        setPageViewModel(nextPageViewModel);
      } catch {
        setPageViewModel(null);
        setErrorMessage('Не удалось загрузить страницу навыка.');
      } finally {
        setIsLoading(false);
      }
    };

    void loadSkillPage();
  }, [skillId]);

  const renderContent = () => {
    if (isLoading) {
      return <SectionBlock>Загрузка...</SectionBlock>;
    }

    if (errorMessage || !pageViewModel) {
      return <SectionBlock>{errorMessage || 'Данные страницы недоступны.'}</SectionBlock>;
    }

    return (
      <>
        <div className={styles.skillSection}>
          <SectionBlock className={styles.userSection}>
            <UserCard {...pageViewModel.ownerCard} className={styles.ownerCard} />
          </SectionBlock>

          <div className={styles.skillContainer}>
            <SkillDetailsPanel
              {...pageViewModel.details}
              showFavoriteButton={true}
              showTopActions={true}
              actions={
                <ProposeExchangeButton
                  skillId={pageViewModel.skillId}
                  ownerUserId={pageViewModel.ownerUserId}
                  className={styles.exchangeButton}
                />
              }
            />
          </div>
        </div>

        <SectionBlock className={styles.similarSection}>
          <UsersListSection title="Похожие предложения">
            {pageViewModel.similarUserCards.map((userCard) => (
              <UserCard key={userCard.id} {...userCard} className={styles.similarUserCard} />
            ))}
          </UsersListSection>
        </SectionBlock>
      </>
    );
  };

  return <div className={styles.pageContent}>{renderContent()}</div>;
};
