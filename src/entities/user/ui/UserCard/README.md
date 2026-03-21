# UserCard

`UserCard` — компонент-контейнер для отображения карточки пользователя.

## Описание

Компонент собирает в одном месте основные элементы карточки пользователя:

- `Avatar`
- `SkillsTags`
- `FavoriteButton`
- кнопку `Подробнее`

Компонент предназначен для переиспользования в списках пользователей, на страницах поиска и в других пользовательских блоках.

## Props

### `name: string`
Имя пользователя.

### `city: string`
Город пользователя.

### `age: number`
Возраст пользователя.

### `avatarSrc?: string | null`
Ссылка на изображение аватара.

### `isFavorite?: boolean`
Состояние кнопки избранного.

По умолчанию: `false`

### `teachingSkills: SkillTagItem[]`
Список навыков, которым пользователь может научить.

### `learningSkills: SkillTagItem[]`
Список навыков, которым пользователь хочет научиться.

### `detailsButtonText?: string`
Текст кнопки действий.

По умолчанию: `Подробнее`

### `onFavoriteClick?: () => void`
Обработчик клика по кнопке избранного.

### `onDetailsClick?: () => void`
Обработчик клика по кнопке `Подробнее`.

### `className?: string`
Дополнительный CSS-класс для внешней стилизации.

## Пример использования

```tsx
import { UserCard } from '@/entities/user/ui/UserCard';

const teachingSkills = [
  {
    id: 1,
    label: 'Игра на барабанах',
    category: 'art',
  },
];

const learningSkills = [
  {
    id: 2,
    label: 'Тайм менеджмент',
    category: 'education',
  },
  {
    id: 3,
    label: 'Медитация',
    category: 'health',
  },
  {
    id: 4,
    label: 'Публичные выступления',
    category: 'business',
  },
];

<UserCard
  name="Иван"
  city="Санкт-Петербург"
  age={34}
  avatarSrc="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80"
  teachingSkills={teachingSkills}
  learningSkills={learningSkills}
  isFavorite={false}
  onFavoriteClick={() => {}}
  onDetailsClick={() => {}}
/>;