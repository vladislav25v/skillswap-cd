# Input

Переиспользуемый компонент текстового поля ввода.

Компонент является обёрткой над стандартным `input` и добавляет:

- поддержку слотов (`leftSlot`, `rightSlot`)
- состояние ошибки
- управление рамкой (`bordered`)
- проброс всех стандартных props `input`
- поддержку `ref`

---

# Props

| Prop        | Type               | Default | Description                                             |
|-------------|--------------------|---------|---------------------------------------------------------|
| `value`     | `string \| number` | —       | Значение поля                                           |
| `error`     | `string`           | —       | Если сообщение об ошибке есть добавляется красная рамка |
| `bordered`  | `boolean`          | `true`  | Показывает рамку у input                                |
| `leftSlot`  | `React.ReactNode`  | —       | Элемент слева внутри поля                               |
| `rightSlot` | `React.ReactNode`  | —       | Элемент справа внутри поля                              |
| `className` | `string`           | —       | Дополнительный CSS класс контейнера                     |

# Slots

| Slot        | Description                                              |
|-------------|----------------------------------------------------------|
| `leftSlot`  | Контент слева от input (обычно иконка)                   |
| `rightSlot` | Контент справа от input (кнопка, индикатор и т.д.)       |

Компонент также принимает **все стандартные props HTML input**, так как наследуется от:

```ts
React.InputHTMLAttributes<HTMLInputElement>
```

Например:

- `placeholder`
- `name`
- `id`
- `type`
- `disabled`
- `autoFocus`
- `maxLength`
- `onChange`
- `onFocus`
- `onBlur`

---

# Примеры

## Базовый input

```tsx
import { useState } from 'react';
import Input from 'shared/ui/Input';

const [value, setValue] = useState('');

<Input
  value={value}
  onChange={(e) => setValue(e.target.value)}
  placeholder="Введите текст"
/>
```

---

## Input с кнопкой действия

```tsx
import { X } from 'lucide-react';

<Input
  value={value}
  onChange={(e) => setValue(e.target.value)}
  rightSlot={
    <button type="button" onClick={() => setValue('')}>
      <X />
    </button>
  }
/>
```

---

# Особенности

- используется `React.forwardRef`
- все стандартные props передаются через `...rest`
- `className` применяется к контейнеру компонента
- слоты позволяют вставлять любые React элементы внутрь поля
- классы объединяются через `filter(Boolean).join(' ')`
