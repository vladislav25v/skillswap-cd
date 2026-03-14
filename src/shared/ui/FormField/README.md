# FormField

Контейнер для элементов формы (input, select, textarea и т.д.), который управляет:

- отображением `label`
- подсказкой (`tip`)
- сообщением об ошибке (`error`)
- генерацией `id` для связи `label` и поля
- передачей `id` и `error` вложенным компонентам через **React Context**

Компонент используется **как обёртка над полем ввода**.

---

## Props

| Prop          | Type              | Default | Description                                                              |
|---------------|-------------------|---------|--------------------------------------------------------------------------|
| `label`       | `string`          | —       | Текст метки поля                                                         |
| `labelHidden` | `boolean`         | `false` | Скрывает label визуально, но оставляет его для screen reader             |
| `htmlFor`     | `string`          | auto    | `id` для связи label и поля. Если не указан — генерируется автоматически |
| `tip`         | `string`          | —       | Подсказка под полем                                                      |
| `error`       | `string`          | —       | Сообщение об ошибке. Если есть — скрывает `tip`                          |
| `className`   | `string`          | —       | Дополнительный CSS класс контейнера                                      |
| `children`    | `React.ReactNode` | —       | Поле формы или любой другой контент                                      |

---

## Context

`FormField` передаёт данные вложенным компонентам через **FormFieldContext**.

```ts
interface FormFieldContextValue {
  fieldId: string
  fieldError: string
}
```

Это позволяет вложенным компонентам автоматически получать id и error.

---

## Примеры

### Базовое поле

```tsx
import FormField from 'shared/ui/FormField';
import Input from 'shared/ui/Input';

<FormField label="Имя">
  <Input />
</FormField>
```

### Поле с подсказкой

```tsx
<FormField
  label="Пароль"
  tip="Минимум 8 символов"
>
  <Input type="password" />
</FormField>
```

### Поле с ошибкой

```tsx
<FormField
  label="Email"
  error="Введите корректный email"
>
  <Input type="email" />
</FormField>;
```

Если передана `error`, подсказка `tip` **не отображается**.

### Скрытый label (для accessibility)

```tsx
<FormField
  label="Поиск"
  labelHidden={true}
>
  <SearchInput placeholder="Поиск..." />
</FormField>
```

`label` будет скрыт визуально, но доступен для **screen reader**.

---

## Особенности

- используется `React.useId()` для генерации уникального `id`
- `label` автоматически связывается с полем через `htmlFor`
- `error` имеет приоритет над `tip`
- `id` и `error` передаются дочерним компонентам через **React Context**
- `className` применяется к контейнеру компонента
- классы объединяются через `filter(Boolean).join(' ')`
