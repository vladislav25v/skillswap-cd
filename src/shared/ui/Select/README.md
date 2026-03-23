# Select Component

Переиспользуемый компонент выпадающего списка с поддержкой контролируемого/неконтролируемого режима и клавиатурной навигации.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `SelectOption[]` | - | Массив опций для выбора |
| `size` | `'short' \| 'standard' \| 'long'` | `'standard'` | Размер компонента |
| `label` | `string` | `undefined` | Текст метки над полем |
| `labelClassName` | `string` | `''` | Дополнительные CSS классы для метки |
| `triggerClassName` | `string` | `''` | Дополнительные CSS классы для кнопки-триггера |
| `value` | `string` | `undefined` | Значение в контролируемом режиме |
| `defaultValue` | `string` | `undefined` | Значение по умолчанию в неконтролируемом режиме |
| `onChange` | `(value: string) => void` | `undefined` | Колбэк при изменении значения |
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
type SelectOption = {
  value: string;      // Уникальное значение опции
  label: string;      // Отображаемый текст
  disabled?: boolean; // Блокирует выбор конкретной опции
};
