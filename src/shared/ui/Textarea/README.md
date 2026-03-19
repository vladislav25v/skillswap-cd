# Textarea

Переиспользуемый компонент многострочного поля ввода (`textarea`) с поддержкой:

- состояния ошибки
- управления рамкой (`bordered`)
- слота справа (`rightSlot`)
- интеграции с `FormFieldContext` для автоматического получения `id` и `error`

---

## Props

| Prop             | Type                                                               | Default | Description                                                  |
|------------------|--------------------------------------------------------------------|---------|--------------------------------------------------------------|
| `value`          | `string`                                                           | —       | Значение поля                                                |
| `error`          | `string`                                                           | —       | Сообщение об ошибке. Если указано, добавляется красная рамка |
| `bordered`       | `boolean`                                                          | `true`  | Показывает рамку у textarea                                  |
| `rightSlot`      | `React.ReactNode`                                                  | —       | Элемент справа от поля (например кнопка, иконка)             |
| `className`      | `string`                                                           | —       | Дополнительный CSS класс контейнера                          |
| **Прочие props** | Наследуются от `React.TextareaHTMLAttributes<HTMLTextAreaElement>` | —       | Все стандартные атрибуты HTML `textarea`                     |

---

## Context

Компонент автоматически использует `FormFieldContext`, если он доступен:

| Поле         | Description                             |
|--------------|-----------------------------------------|
| `fieldId`    | id поля, передаваемый из FormField      |
| `fieldError` | текст ошибки, передаваемый из FormField |

Если контекст не доступен, можно передать `id` и `error` через props напрямую.

---

## Slots

| Slot        | Description                                                            |
|-------------|------------------------------------------------------------------------|
| `rightSlot` | Элемент, который отображается справа от поля (например кнопка очистки) |

---

## Примеры

### Базовый Textarea

```tsx
import Textarea from '@/shared/ui/Textarea';

<Textarea
  value={value}
  onChange={(e) => setValue(e.target.value)}
  placeholder="Введите текст"
/>
```

### Использование внутри FormField

```jsx
import FormField from '@/shared/ui/FormField';
import Textarea from '@/shared/ui/Textarea';

<FormField label="О себе" error="Обязательное поле">
  <Textarea />
</FormField>
```

- `Textarea` автоматически получает `id` и `error` из контекста
- нет необходимости указывать `id` вручную

---

## Особенности

- используется `React.forwardRef`
- интеграция с `FormFieldContext` для автоматического получения `id` и `error`
- поддержка слота справа (`rightSlot`)
- рамка отображается по умолчанию (`bordered = true`)
- классы объединяются через `clsx` для управления состояниями (`error`, `bordered`, кастомные классы)
