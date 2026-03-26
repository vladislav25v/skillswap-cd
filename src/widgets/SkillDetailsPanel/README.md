# SkillDetailsPanel

Виджет карточки навыка с текстовым описанием, галереей изображений, верхним тулбаром и нижним блоком действий.

Компонент собирает:

- заголовок карточки
- мета-информацию
- описание навыка
- галерею изображений
- кнопку избранного
- локальные top actions
- слот для нижних action-кнопок

## Props

| Prop                 | Type         | Default | Description                              |
|----------------------|--------------|---------|------------------------------------------|
| `title`              | `string`     | —       | Основной заголовок карточки              |
| `meta`               | `string`     | —       | Вторичная строка под заголовком          |
| `description`        | `string`     | —       | Описание навыка                          |
| `images`             | `string[]`   | —       | Массив URL изображений                   |
| `imageAlt`           | `string`     | `''`    | Alt для основного изображения в галерее  |
| `actions`            | `ReactNode`  | —       | Нижний слот с action-кнопками            |
| `headerTitle`        | `string`     | —       | Заголовок верхнего блока над карточкой   |
| `headerDescription`  | `string`     | —       | Подпись верхнего блока над карточкой     |
| `showFavoriteButton` | `boolean`    | `false` | Показывает `FavoriteButton` в тулбаре    |
| `showTopActions`     | `boolean`    | `false` | Показывает локальные кнопки share / more |
| `isFavorite`         | `boolean`    | `false` | Состояние `FavoriteButton`               |
| `onFavoriteClick`    | `() => void` | —       | Обработчик клика по `FavoriteButton`     |
| `className`          | `string`     | —       | Дополнительный класс внешней обертки     |
| `panelClassName`     | `string`     | —       | Дополнительный класс блока panel         |
| `contentClassName`   | `string`     | —       | Дополнительный класс блока content       |

## Структура

- `panelShell` — внешний container-query контейнер
- `panel` — визуальная оболочка карточки
- `toolbar` — верхняя строка с `FavoriteButton` и top actions
- `content` — основная grid-раскладка
- `textBlock` — текстовая колонка
- `media` — колонка галереи
- `actions` — нижний слот кнопок

## Особенности

- Адаптивность завязана на `@container`, а не на ширину окна
- На desktop layout двухколоночный: текст слева, галерея справа
- На узком контейнере layout перестраивается в одну колонку
- `actions` принимает готовые UI-кнопки через слот, а не генерирует их сам
- Верхние кнопки share / more являются локальной частью виджета

## Пример использования

```tsx
import Button from '@/shared/ui/Button/Button';
import { SkillDetailsPanel } from '@/widgets/SkillDetailsPanel';

<SkillDetailsPanel
  title="Фотосъемка"
  meta="Творчество / Фото"
  description="Портретная и предметная съемка"
  images={['/img/photo-1.jpg', '/img/photo-2.jpg']}
  imageAlt="Фотосъемка"
  showFavoriteButton={true}
  showTopActions={true}
  isFavorite={false}
  onFavoriteClick={() => {
  }}
  actions={
    <>
      <Button variant="secondary">Редактировать</Button>
      <Button>Готово</Button>
    </>
  }
/>;
```

## Зависимости

- `FavoriteButton` из `shared/ui`
- `SkillImageGallery` из `widgets/SkillDetailsPanel/ui`
- `lucide-react` для локальных top actions
- `Button` из `shared/ui`
