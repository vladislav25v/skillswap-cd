# Checkbox

Переиспользуемый компонент чекбокса.

## Props

| Prop       | Type                     | Default  | Description                          |
|------------|--------------------------|----------|--------------------------------------|
| `checked`  | `boolean`                | `false`  | Состояние чекбокса                   |
| `onChange` | `(checked: boolean) => void` | —     | Функция, вызываемая при изменении    |
| `label`    | `string`                 | —        | Текст рядом с чекбоксом              |
| `disabled` | `boolean`                | `false`  | Блокирует взаимодействие              |
| `id`       | `string`                 | —        | Уникальный id для связи label и input |

## Пример использования

```tsx
import { Checkbox } from 'shared/ui/Checkbox';

const [isAgreed, setIsAgreed] = useState(false);

<Checkbox
  checked={isAgreed}
  onChange={setIsAgreed}
  label="Я согласен с условиями"
/>

<Checkbox
  checked={true}
  onChange={() => {}}
  label="Заблокированный"
  disabled
/>