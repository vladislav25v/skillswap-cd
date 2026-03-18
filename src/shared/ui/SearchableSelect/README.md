# SearchableSelect Component

Компонент выпадающего списка с поиском, поддерживающий контролируемый/неконтролируемый режим, группировку опций по категориям и клавиатурную навигацию.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `SearchableOption[]` | - | Массив опций для выбора с поддержкой категорий |
| `value` | `string` | `undefined` | Значение в контролируемом режиме |
| `defaultValue` | `string` | `''` | Значение по умолчанию в неконтролируемом режиме |
| `onChange` | `(value: string) => void` | `undefined` | Колбэк при изменении значения |
| `onSearch` | `(searchTerm: string) => void` | `undefined` | Колбэк при вводе текста поиска |
| `placeholder` | `string` | `'Выберите значение'` | Текст-подсказка в поле ввода |
| `searchPlaceholder` | `string` | `'Поиск...'` | Текст-подсказка в режиме поиска |
| `label` | `string` | `undefined` | Текст метки над полем |
| `error` | `string` | `undefined` | Текст ошибки (отображается под полем) |
| `disabled` | `boolean` | `false` | Блокирует взаимодействие с компонентом |
| `required` | `boolean` | `false` | Добавляет звездочку (*) к метке |
| `name` | `string` | `undefined` | Имя поля для отправки формы |
| `id` | `string` | `undefined` | ID компонента |
| `className` | `string` | `''` | Дополнительные CSS классы для корневого элемента |
| `maxHeight` | `number` | `300` | Максимальная высота выпадающего списка (в px) |
| `noResultsText` | `string` | `'Ничего не найдено'` | Текст при отсутствии результатов поиска |

## Types

```typescript
type SearchableOption = {
  value: string;      // Уникальное значение опции
  label: string;      // Отображаемый текст
  category?: string;  // Категория для группировки (опционально)
  disabled?: boolean; // Блокирует выбор конкретной опции
};
