# SectionBlock

Контейнер основной части страницы. Отвечает за вертикальный стек секций и отступы.

## Props
- `children: React.ReactNode` — содержимое секций
- `className?: string` — дополнительные классы для модификации контейнера

## Особенности
- Колонка (`flex-direction: column`)
- `gap: 40px` между секциями
- Растягивается на доступную ширину (`flex: 1`)


## Пример
```tsx
import { SectionBlock } from '@/widgets/SectionBlock';
import styles from './Page.module.css';

<SectionBlock className={styles.content}>
  <UsersListSection title="Популярное" />
  <UsersListSection title="Новое" />
</SectionBlock>
