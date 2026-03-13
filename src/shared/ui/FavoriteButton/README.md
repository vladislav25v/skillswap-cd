# FavoriteButton

`FavoriteButton` — переиспользуемый UI-компонент кнопки избранного с иконкой сердечка.

## Описание

Компонент используется для отображения состояния избранного и поддерживает два состояния:

- `default` — обычное состояние кнопки
- `active` — активное состояние кнопки

Компонент можно использовать в карточках пользователей и в других частях приложения.

## Props

### `isActive?: boolean`
Определяет состояние кнопки.

- `false` — состояние `default`
- `true` — состояние `active`

По умолчанию: `false`

### `onClick?: () => void`
Функция-обработчик, которая вызывается при нажатии на кнопку.

### `className?: string`
Дополнительный CSS-класс для внешней стилизации компонента.

### `ariaLabel?: string`
Текст для атрибута `aria-label`, нужен для доступности.

По умолчанию: `Добавить в избранное`

## Пример использования

```tsx
import { useState } from 'react';
import { FavoriteButton } from './FavoriteButton';

export function Example() {
  const [isActive, setIsActive] = useState(false);

  return (
    <FavoriteButton
      isActive={isActive}
      onClick={() => setIsActive((prev) => !prev)}
    />
  );
}