# SkillPicturesPickerPreviews

Компонент для отображения превью изображений навыков с возможностью их очистки.

Используется вместе с загрузчиком файлов (например, `SkillPicturesPicker`) для:

- отображения выбранных изображений
- быстрого просмотра
- очистки списка

---

## Props

| Prop        | Type         | Default | Description                             |
|-------------|--------------|---------|-----------------------------------------|
| `className` | `string`     | —       | Дополнительный CSS класс контейнера     |
| `previews`  | `string[]`   | —       | Массив URL изображений (превью)         |
| `onClear`   | `() => void` | —       | Callback для очистки списка изображений |

---

## Примеры

### Базовое использование

```tsx
import SkillPicturesPickerPreviews from '@/features/SkillPicturesPickerPreviews';

<SkillPicturesPickerPreviews
  previews={images}
  onClear={() => setImages([])}
/>
```

---

## Структура

```html

<div class="previews">
  <ul class="list">
    <li class="item">
      <img class="image" />
    </li>
  </ul>

  <button class="clearBtn">
    <svg /> Очистить
  </button>
</div>
```

---

## Поведение

- компонент отображает список изображений (`previews`)
- каждое изображение рендерится как `<img>`
- кнопка **Очистить** вызывает `onClear`
- количество изображений динамически зависит от массива `previews`
