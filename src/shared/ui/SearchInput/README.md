# SearchInput

Текстовое поле поиска с иконкой лупы слева и кнопкой очистки справа.

Компонент является обёрткой над Input и добавляет:

- иконку поиска слева
- кнопку очистки справа (появляется только если есть значение)
- управление значением через callback onChange
- проброс всех стандартных props input (кроме type, leftSlot, rightSlot)
- поддержку ref

---

# Props

| Prop          | Type                      | Default | Description                                              |
|---------------|---------------------------|---------|----------------------------------------------------------|
| `value`       | `string`                  | —       | Значение поля                                            |
| `onChange`    | `(value: string) => void` | —       | Callback при изменении текста, возвращает новое значение |
| `placeholder` | `string`                  | —       | Текст-подсказка в поле                                   |
| `bordered`    | `boolean`                 | `false` | Показывает рамку у input                                 |
| `className`   | `string`                  | —       | Дополнительный CSS класс контейнера                      |

Компонент наследует все стандартные props HTML input через `InputProps`, кроме `type`, `leftSlot` и `rightSlot`.

---

# Примеры

## Базовый SearchInput

```tsx
import { useState } from 'react';
import SearchInput from 'shared/ui/SearchInput';

const [query, setQuery] = useState('');

<SearchInput
  value={query}
  onChange={setQuery}
  placeholder="Поиск..."
/>
```

---

# Особенности

- Использует `React.forwardRef`
- Тип инпута всегда 'search'
- Слот `leftSlot` фиксирован под иконку поиска
- Слот `rightSlot` автоматически появляется при наличии значения
- Все стандартные props передаются через `...rest`
- `className` применяется к контейнеру компонента
