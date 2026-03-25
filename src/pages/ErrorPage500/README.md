# Error500

Страница ошибки 500 (Internal Server Error). Показывается, когда на сервере произошла ошибка.

## Структура
src/pages/Error500/
├── Error500.tsx # компонент страницы
├── Error500.module.css # стили
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
import { Error500 } from './pages/Error500/Error500';

function App() {
  return <Error500 />;
}

export default App;
