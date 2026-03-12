# CardsGridContainer

Переиспользуемый контейнер‑сетка для карточек пользователей.

## Props
- `children: React.ReactNode` — карточки пользователей
- `className?: string` — дополнительные классы для модификации контейнера

## Особенности
- Адаптивное количество колонок по ширине контейнера
- `min` ширина карточки 324px
- `gap: 24px` между карточками

## Пример
```tsx
import { CardsGridContainer } from '@/shared/ui/CardsGridContainer';

<CardsGridContainer>
  <UserCard />
  <UserCard />
  <UserCard />
</CardsGridContainer>
