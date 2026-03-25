# SkillPicturesPicker

Компонент для загрузки изображений навыков с поддержкой:

- drag & drop
- выбора файлов через диалог
- предпросмотра изображений
- очистки списка
- передачи выбранных файлов наружу

Используется в формах создания/редактирования навыков.

---

## Props

| Prop            | Type                      | Default | Description                          |
|-----------------|---------------------------|---------|--------------------------------------|
| `className`     | `string`                  | —       | Дополнительный CSS класс контейнера  |
| `onFilesChange` | `(files: File[]) => void` | —       | Callback при изменении списка файлов |

---

## Примеры

### Базовое использование

```tsx
import SkillPicturesPicker from '@/widgets/SkillPicturesPicker';

const [files, setFiles] = useState<File[]>([]);

<SkillPicturesPicker
  onFilesChange={setFiles}
/>;
```

---

## Поведение

### Добавление файлов

Файлы можно добавить двумя способами:

#### 1. Через кнопку

```
Выбрать изображения
```

Открывается стандартный диалог выбора файлов.

#### 2. Drag & Drop

- перетащить изображения в область загрузки
- принимаются только файлы с типом `image/*`

### Превью

- после выбора создаются preview URL через `URL.createObjectURL`
- отображаются через `SkillPicturesPickerPreviews`
- при размонтировании URL очищаются (`URL.revokeObjectURL`)

### Очистка

Кнопка **Очистить**:

- удаляет все файлы
- очищает input (`input.value = ''`)
- вызывает `onFilesChange([])`

### Обновление файлов

```tsx
setFiles((oldFiles) => [...oldFiles, ...newFiles]);
```

Новые файлы **добавляются**, а не заменяют старые

--- 

## Ограничения

- принимаются только изображения (`image/*`)
- другие файлы игнорируются
- нет ограничения на количество файлов (контролируется извне)

---

## Структура

```html

<div class="container">
  <label class="dropZone">
    <input type="file" multiple />
    <span>Перетащите или выберите изображения</span>
    <button>Выбрать изображения</button>
  </label>

  <SkillPicturesPickerPreviews />
</div>
```

---

## Особенности

- используется `useRef` для управления `<input type="file">`
- используется `useMemo` для генерации preview URL
- используется `useEffect` для:
  - синхронизации файлов (`onFilesChange`)
  - очистки URL
  - предотвращения drop вне зоны
- состояние `isDragging` управляет стилем drop-зоны
- поддержка множественной загрузки (`multiple`)
- файлы накапливаются (append mode)

