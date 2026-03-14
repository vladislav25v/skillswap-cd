# Page505

Страница ошибки 500 (Internal Server Error). Показывается, когда на сервере произошла ошибка.

## Структура
src/pages/Page505/
├── Page505.tsx # компонент страницы
├── Page505.module.css # стили
└── README.md # документация

text

## Используемые компоненты

- `widgets/Header` - шапка сайта
- `widgets/Footer` - подвал сайта
- `shared/ui/Button` - кнопки
- `assets/error500.png` - изображение ошибки

## Как проверить страницу

Временно в `App.tsx`:
```tsx
import { Page505 } from './pages/Page505/Page505';

function App() {
  return <Page505 />;
}