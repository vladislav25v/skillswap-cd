# UsersListSection

Компонент секции для отображения списка пользователей.  
Обеспечивает единый layout для блока с заголовком и содержимым.

Компонент включает:

- заголовок через компонент `Title`
- дополнительный слот рядом с заголовком (`headlineExtraSlot`)
- контейнер для контента (например список пользователей)

Используется для построения страниц со структурированными блоками.

---

## Props

| Prop                | Type                           | Default    | Description                               |
|---------------------|--------------------------------|------------|-------------------------------------------|
| `title`             | `string`                       | —          | Текст заголовка секции                    |
| `titleTag`          | `'h1' \| 'h2' \| 'h3' \| 'h4'` | `'h2'`     | HTML тег заголовка                        |
| `titleTagLooksLike` | `'h1' \| 'h2' \| 'h3' \| 'h4'` | `titleTag` | Визуальный стиль заголовка                |
| `headlineExtraSlot` | `React.ReactNode`              | —          | Дополнительный элемент рядом с заголовком |
| `className`         | `string`                       | —          | Дополнительный CSS класс контейнера       |
| `children`          | `React.ReactNode`              | —          | Контент секции                            |

---

## Slots

| Slot                | Description                                                        |
|---------------------|--------------------------------------------------------------------|
| `headlineExtraSlot` | Контент справа от заголовка (например кнопка, фильтр или действия) |
| `children`          | Основное содержимое секции                                         |

---

## Примеры

### Базовая секция

```tsx
import UsersListSection from '@/widgets/UsersListSection';

<UsersListSection title="Рекомендуем">
  <UserCard />
  <UserCard />
  <UserCard />
</UsersListSection>
```

### С кнопкой действия

```jsx
import { Button } from '@/shared/ui/Button';

<UsersListSection
  title="Пользователи"
  headlineExtraSlot={<Button>Добавить пользователя</Button>}
>
  <UserCard />
  <UserCard />
  <UserCard />
</UsersListSection>;
```

### Разделение семантики и внешнего вида заголовка

```jsx
<UsersListSection
  title="Модераторы"
  titleTag="h3"
  titleTagLooksLike="h2"
>
  <UserCard />
  <UserCard />
  <UserCard />
</UsersListSection>
```

Это позволяет:

- сохранить правильную иерархию заголовков
- визуально использовать более крупный стиль

---

## Особенности

- использует семантический тег `<section>`
- заголовок рендерится через компонент `Title`
- поддерживает разделение семантики и визуального стиля заголовка
- `headlineExtraSlot` позволяет добавлять элементы управления рядом с заголовком
- `className` добавляется к контейнеру секции
