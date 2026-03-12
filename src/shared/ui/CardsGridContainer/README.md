# CardsGridContainer

Переиспользуемый контейнер‑сетка для карточек пользователей.

## Props
- `children: React.ReactNode` — карточки пользователей

## Особенности
- 3 колонки
- `gap: 24px` между карточками

## Пример
```tsx
import { CardsGridContainer } from '@/shared/ui/CardsGridContainer';

<CardsGridContainer>
  <UserCard />
  <UserCard />
  <UserCard />
</CardsGridContainer>
