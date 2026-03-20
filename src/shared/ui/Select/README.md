# Select Component

Переиспользуемый компонент выпадающего списка с поддержкой контролируемого/неконтролируемого режима и клавиатурной навигации.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `SelectOption<T>[]` | - | Массив опций для выбора |
| `size` | `'short' \| 'standard' \| 'long'` | `'standard'` | Размер компонента |
| `label` | `string` | `undefined` | Текст метки над полем |
| `labelClassName` | `string` | `''` | Дополнительные CSS классы для метки |
| `triggerClassName` | `string` | `''` | Дополнительные CSS классы для кнопки-триггера |
| `value` | `T` | `undefined` | Значение в контролируемом режиме |
| `defaultValue` | `T` | `undefined` | Значение по умолчанию в неконтролируемом режиме |
| `onChange` | `(value: T) => void` | `undefined` | Колбэк при изменении значения |
| `placeholder` | `string` | `'Выберите значение'` | Текст-подсказка, когда ничего не выбрано |
| `unknownValuePlaceholder` | `string` | `'Значение не найдено'` | Текст, когда значение отсутствует в опциях |
| `disabled` | `boolean` | `false` | Блокирует взаимодействие с компонентом |
| `error` | `string` | `undefined` | Текст ошибки (отображается под полем) |
| `name` | `string` | `undefined` | Имя поля для отправки формы |
| `id` | `string` | `undefined` | ID компонента (генерируется автоматически, если не указан) |
| `className` | `string` | `''` | Дополнительные CSS классы для корневого элемента |
| `valueClassName` | `string` | `''` | Дополнительные CSS классы для отображаемого значения |

## Размеры

- `short` - 208px (для компактных форм)
- `standard` - 100% ширины родителя (по умолчанию)
- `long` - 436px (для длинных значений)

## Types

```typescript
type SelectOption<T = string> = {
  value: T;           // Значение
  label: string;      // Отображаемый текст
  disabled?: boolean; // Блокировка опции
};
```

---

## Режимы работы

### Контролируемый

```tsx
const [value, setValue] = useState<string>();

<Select
  options={options}
  value={value}
  onChange={setValue}
/>
```

- значение полностью управляется извне
- компонент не хранит состояние

### Неконтролируемый

```tsx
<Select
  options={options}
  defaultValue="apple"
/>
```

- состояние хранится внутри компонента
- `onChange` — опционален

## Примеры

### Базовый Select

```tsx
<Select
  options={[
    { value: 'apple', label: 'Яблоко' },
    { value: 'banana', label: 'Банан' },
  ]}
/>
```

### С label и ошибкой

```tsx
<Select
  label="Фрукт"
  options={options}
  error="Обязательное поле"
/>
```

### Disabled опции

```tsx
<Select
  options={[
    { value: '1', label: 'Доступно' },
    { value: '2', label: 'Недоступно', disabled: true },
  ]}
/>
```
