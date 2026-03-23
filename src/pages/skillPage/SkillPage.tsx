//import React from 'react';
import { Header } from '../../widgets/Header';
import { Footer } from '../../widgets/Footer';
import { SkillDetailsPanel } from '../../widgets/SkillDetailsPanel';
import UsersListSection from '../../widgets/UsersListSection';
import { SectionBlock } from '../../widgets/SectionBlock';
import Avatar from '../../shared/ui/Avatar/Avatar';
import { SkillsTags } from '../../shared/ui/Skilltags/Skilltags';
import styles from './SkillPage.module.css';

// Вспомогательная функция для определения категории тега
const getCategoryForSkill = (
  skill: string,
): 'business' | 'art' | 'languages' | 'education' | 'home' | 'health' => {
  const categories: Record<
    string,
    'business' | 'art' | 'languages' | 'education' | 'home' | 'health'
  > = {
    // Бизнес и карьера
    Дизайн: 'business',
    'Тайм-менеджмент': 'business',
    'Управление проектами': 'business',
    Лидерство: 'business',
    Маркетинг: 'business',

    // Творчество и искусство
    Фотография: 'art',
    Lightroom: 'art',
    Photoshop: 'art',
    Видеомонтаж: 'art',
    Рисование: 'art',
    Видеосъемка: 'art',
    Музыка: 'art',

    // Иностранные языки
    Английский: 'languages',
    Испанский: 'languages',
    Французский: 'languages',
    Немецкий: 'languages',

    // Образование и развитие
    Математика: 'education',
    Программирование: 'education',
    'Навыки публичных выступлений': 'education',

    // Дом и уют
    Кулинария: 'home',
    Ремонт: 'home',
    Садоводство: 'home',

    // Здоровье и лайфстайл
    Медитация: 'health',
    Йога: 'health',
    Фитнес: 'health',
    'Правильное питание': 'health',
  };

  return categories[skill] || 'education';
};

// Моковые данные
const mockSkill = {
  title: 'Фотография',
  description: 'Научу работать в Lightroom и Photoshop. Помогу разобраться с композицией и светом.',
  meta: 'Творчество • Фотография',
  images: [
    'https://picsum.photos/id/100/400/300',
    'https://picsum.photos/id/101/400/300',
    'https://picsum.photos/id/102/400/300',
  ],
};

const mockUsers = [
  {
    id: 1,
    name: 'Анна С.',
    city: 'Москва',
    age: 28,
    about: 'Фотограф с 5-летним опытом. Преподаю основы композиции и работу со светом.',
    avatar: 'https://i.pravatar.cc/150?img=1',
    skillsOffered: ['Фотография', 'Lightroom'],
    skillsWanted: ['Photoshop', 'Видеомонтаж'],
  },
  {
    id: 2,
    name: 'Дмитрий К.',
    city: 'СПб',
    age: 32,
    about: 'Преподаю фотографию и обработку',
    avatar: 'https://i.pravatar.cc/150?img=2',
    skillsOffered: ['Фотография'],
    skillsWanted: ['Дизайн'],
  },
  {
    id: 3,
    name: 'Елена М.',
    city: 'Казань',
    age: 26,
    about: 'Хочу научиться фотографии',
    avatar: 'https://i.pravatar.cc/150?img=3',
    skillsOffered: ['Рисование'],
    skillsWanted: ['Фотография'],
  },
  {
    id: 4,
    name: 'Ольга П.',
    city: 'Новосибирск',
    age: 30,
    about: 'Ищу наставника по фото',
    avatar: 'https://i.pravatar.cc/150?img=4',
    skillsOffered: ['Видеосъемка'],
    skillsWanted: ['Фотография'],
  },
];

// Компонент UserCard с SkillsTags
const UserCard = ({ user }: { user: (typeof mockUsers)[0] }) => {
  const teachingSkills = user.skillsOffered.map((skill) => ({
    id: skill,
    label: skill,
    category: getCategoryForSkill(skill),
  }));

  const learningSkills = user.skillsWanted.map((skill) => ({
    id: skill,
    label: skill,
    category: getCategoryForSkill(skill),
  }));

  return (
    <div className={styles.userCard}>
      <div className={styles.userCardHeader}>
        <Avatar src={user.avatar} alt={user.name} size="medium" />
        <div className={styles.userHeaderInfo}>
          <div className={styles.userName}>{user.name}</div>
          <div className={styles.userMeta}>
            {user.city}, {user.age} лет
          </div>
        </div>
      </div>

      <p className={styles.userBio}>{user.about}</p>

      <SkillsTags
        teachingSkills={teachingSkills}
        learningSkills={learningSkills}
        maxVisibleTags={3}
      />
    </div>
  );
};

export const SkillPage = () => {
  return (
    <>
      <Header />
      <div className={styles.pageContent}>
        <div className={styles.skillSection}>
          {/* Левая колонка — UserCard */}
          <SectionBlock className={styles.userSection}>
            <UserCard user={mockUsers[0]} />
          </SectionBlock>

          {/* Правая колонка — SkillDetailsPanel */}
          <div className={styles.skillContainer}>
            <SkillDetailsPanel
              title={mockSkill.title}
              description={mockSkill.description}
              meta={mockSkill.meta}
              images={mockSkill.images}
              showFavoriteButton={true}
              showTopActions={true}
              actions={<button className={styles.exchangeButton}>Предложить обмен</button>}
            />
          </div>
        </div>

        {/* Нижняя секция — похожие предложения */}
        <SectionBlock className={styles.similarSection}>
          <UsersListSection title="Похожие предложения">
            <div className={styles.similarGrid}>
              {mockUsers.map((user) => {
                const teachingSkills = user.skillsOffered.map((skill) => ({
                  id: skill,
                  label: skill,
                  category: getCategoryForSkill(skill),
                }));

                const learningSkills = user.skillsWanted.map((skill) => ({
                  id: skill,
                  label: skill,
                  category: getCategoryForSkill(skill),
                }));

                return (
                  <div key={user.id} className={styles.similarCard}>
                    <div className={styles.similarCardHeader}>
                      <Avatar src={user.avatar} alt={user.name} size="medium" />
                      <div className={styles.similarInfo}>
                        <div className={styles.similarName}>{user.name}</div>
                        <div className={styles.similarMeta}>
                          {user.city}, {user.age} лет
                        </div>
                      </div>
                    </div>

                    <SkillsTags
                      teachingSkills={teachingSkills}
                      learningSkills={learningSkills}
                      maxVisibleTags={2}
                    />

                    <button className={styles.moreButton}>Подробнее</button>
                  </div>
                );
              })}
            </div>
          </UsersListSection>
        </SectionBlock>
      </div>
      <Footer />
    </>
  );
};
