# FilterSidebar Widget

Виджет боковой панели фильтрации для платформы SkillSwap. Предоставляет интерфейс для фильтрации постов по различным критериям.

## Структура компонентов

```
FilterSidebar/
├── components/
│ ├── FilterCheckboxGroup/ # Группа чекбоксов с категориями и подкатегориями
│ ├── FilterCityCheckbox/ # Фильтр по городам с раскрывающимся списком
│ ├── FilterGenderRadioGroup/ # Фильтр по полу автора
│ ├── FilterLearnOrTeachRadioGroup/ # Основной фильтр (All/Want to learn/Can teach)
│ └── FilterSidebarHeader/ # Заголовок с количеством активных фильтров и кнопкой сброса
├── demo/ # Демонстрационный компонент
├── FilterSidebar.tsx # Основной компонент
├── FilterSidebar.module.css # Стили основного компонента
├── index.ts # Точка экспорта
└── README.md # Документация
```

**Props:**

| Prop | Тип | Обязательный | Описание |
|------|-----|--------------|----------|
| `title` | `string` | Да | Заголовок группы |
| `options` | `FilterOption[]` | Да | Массив опций с поддержкой вложенности |
| `name` | `string` | Да | Имя для генерации id |
| `showAllLink?` | `boolean` | Нет | Показывать ссылку "Все категории" |
| `allLinkText?` | `React.ReactNode` | Нет | Текст ссылки (по умолчанию "All categories") |
| `onAllLinkClick?` | `() => void` | Нет | Обработчик клика по ссылке |
| `onChange?` | `(selectedValues: string[]) => void` | Нет | Callback при изменении выбора |