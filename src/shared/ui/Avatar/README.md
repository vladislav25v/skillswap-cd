# Avatar Component

Переиспользуемый компонент аватара с двумя вариациями: photo и placeholder.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string \| null \| undefined` | `undefined` | URL изображения. Если не указан, отображается placeholder |
| `alt` | `string` | `''` | Альтернативный текст (используется для инициалов в placeholder) |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Размер аватара |
| `isNewProfile` | `boolean` | `false` | Флаг для создаваемого профиля (отображает плюсик вместо инициалов) |
| `className` | `string` | `''` | Дополнительные CSS классы |
| `...props` | `React.ImgHTMLAttributes<HTMLImageElement>` | - | Все остальные пропсы передаются в корневой элемент |

## Размеры

- `small` - 44x44px (для компактных списков)
- `medium` - 100x100px (для карточек в списке, по умолчанию)
- `large` - 244x244px (для профиля пользователя)