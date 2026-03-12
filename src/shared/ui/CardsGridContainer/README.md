# CardsGridContainer

Контейнер для размещения секций пользователей на странице.
Отвечает только за вертикальный отступ между секциями.

## Props
- `children: React.ReactNode` — секции пользователей

## Особенности
- `gap: 40px` между секциями

## Пример
```tsx
import { CardsGridContainer } from '@/shared/ui/CardsGridContainer';
import { UsersListSection } from '@/widgets/UsersListSection';

<CardsGridContainer>
  <UsersListSection title="Популярное" />
  <UsersListSection title="Новое" />
  <UsersListSection title="Рекомендуем" />
</CardsGridContainer>
