# Button

Переиспользуемая кнопка.

## Props
- `children: ReactNode` — содержимое
- `variant?: 'primary' | 'secondary' | 'tertiary'` — стиль кнопки
- `type?: 'button' | 'submit' | 'reset'` — тип
- `onClick?: () => void` — обработчик клика
- `className?: string` — дополнительные классы
- `disabled?: boolean` — disabled

## Варианты
- `primary` — акцентная заливка
- `secondary` — белая с бордером
- `tertiary` — белая без бордера

## Пример
```tsx
import Button from '@/shared/ui/Button/Button';

<Button variant="primary">Сохранить</Button>
<Button variant="secondary">Отмена</Button>
<Button variant="tertiary">Смотреть все</Button>
