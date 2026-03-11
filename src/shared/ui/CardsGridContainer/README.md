# CardsGridContainer

Секционный контейнер с заголовком и сеткой карточек. В шапке показывается заголовок и кнопка "Смотреть все" с иконкой.

## Props
- `title: string` — заголовок секции
- `children: React.ReactNode` — содержимое сетки (карточки)
- `onShowAll?: () => void` — обработчик кнопки

## Особенности
- Заголовок и кнопка выровнены по краям, высота шапки `48px`, отступ снизу `32px`
- Сетка на 3 колонки, `gap: 24px`
- Контейнер ограничен `max-width: 1020px`
- Фон сетки — `var(--color-surface)`, скругление `12px`
- Кнопка использует `Button` с `variant="primary"` и дополнительным классом `showAllButton`

## Пример
```tsx
import { CardsGridContainer } from '@/shared/ui/CardsGridContainer';

<CardsGridContainer title="Популярное" onShowAll={() => {}}>
  <UserCard />
  <UserCard />
  <UserCard />
</CardsGridContainer>
