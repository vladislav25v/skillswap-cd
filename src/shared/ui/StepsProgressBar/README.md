# StepsProgressBar

Компонент прогресс-бара для отображения текущего шага в многошаговом процессе (wizard / form steps).

Позволяет:

- визуально показать общее количество шагов
- выделить текущий шаг
- отображать дополнительный контент (например заголовок или описание)

---

## Props

| Prop        | Type              | Default | Description                               |
|-------------|-------------------|---------|-------------------------------------------|
| `current`   | `number`          | —       | Текущий шаг (начиная с 1)                 |
| `total`     | `number`          | —       | Общее количество шагов                    |
| `className` | `string`          | —       | Дополнительный CSS класс для списка шагов |
| `children`  | `React.ReactNode` | —       | Контент над прогресс-баром                |

---

## Примеры

### Базовый прогресс

```tsx
import StepsProgressBar from '@/shared/ui/StepsProgressBar';

<StepsProgressBar current={2} total={5} />
```

### С заголовком

```tsx
<StepsProgressBar current={1} total={3}>
  <h2>Шаг 1 из 3</h2>
</StepsProgressBar>
```

---

## Поведение

- количество шагов генерируется через:

```ts
Array.from({ length: total })
```

- текущий шаг определяется по условию:

```ts
index + 1 === current
```

- активный шаг получает отдельный CSS класс

---

## Структура

```html

<div class="wrapper">
  <!-- children -->

  <div class="steps">
    <span class="stepItem"></span>
    <span class="stepItem stepItemCurrent"></span>
    <span class="stepItem"></span>
  </div>
</div>
```

---

## Особенности

- текущий шаг считается с **1**, а не с 0
- `children` отображается над прогресс-баром
- визуальная часть (`steps`) помечена как `aria-hidden`
