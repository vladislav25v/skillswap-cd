# Правила работы с репозиторием

## 1. Основные ветки

- **main** — стабильная ветка, содержит только готовый к продакшену код
- **develop** — основная ветка для разработки  
  Никакие изменения **не вносятся напрямую** — только через Pull Request (PR)

## 2. Работа над задачами — через отдельные ветки

Каждая новая задача выполняется в **новой ветке**, созданной от `develop`.

### Формат названия ветки

<тип>/<короткое-описание-задачи>
text### Примеры:

- `feature/add-header`
- `fix/fix-button-alignment`
- `refactor/cleanup-home-page`
- `docs/update-readme`

### Используемые типы веток

- `feature/` — новая фича или компонент
- `fix/` — исправление бага
- `refactor/` — улучшение кода без изменения поведения
- `docs/` — изменения в документации
- `chore/` — служебные задачи (обновление зависимостей, конфигов и т.д.)

## 3. Как работать над задачей

1. Обнови `develop`:
   ```bash
   git checkout develop
   git pull
   ```

Создай ветку для задачи:Bashgit 
```
checkout -b feature/add-footer
```
Делай осмысленные коммиты (желательно в стиле Conventional Commits):
```
textfeat: добавлен компонент Footer
Создай ветку для задачи:Bashgit 
```
checkout -b feature/add-footer
```
Делай осмысленные коммиты (желательно в стиле Conventional Commits):
```
textfeat: добавлен компонент Footer
fix: исправлен отступ у блока Services
refactor: переименованы переменные в utils/helpers
```

Запушь ветку:Bashgit 
```
push -u origin feature/add-footer
```

Запушь ветку:Bashgit push -u origin feature/add-footer
Создай ветку для задачи:Bashgit

```
checkout -b feature/add-footer
```

Делай осмысленные коммиты (желательно в стиле Conventional Commits):

```
textfeat: добавлен компонент Footer
fix: исправлен отступ у блока Services
refactor: переименованы переменные в utils/helpers
```

Запушь ветку:Bashgit

```
push -u origin feature/add-footer
```

Создай Pull Request:
из твоей ветки → в develop

4. Code Review & слияние

Все изменения в develop вливаются только через Pull Request
PR должен быть проверен и одобрен тимлидом или его заместителем
Запрещено:

```
git push --force в main / develop
git merge --no-ff в main / develop
```
```

## 4. Архитектура проекта

```
src/
 ├── api/              # методы работы с мок-JSON (axios/fetch)
 ├── app/              # инициализация, провайдеры, глобальные стили
 ├── entities/         # модели домена (Skill, User, Request)
 ├── features/
 │    ├── auth/
 │    ├── skills/
 │    ├── favorites/
 │    └── requests/
 ├── widgets/          # готовые фич-блоки (SkillCard, FiltersBar)
 ├── pages/            # главная, профайл, skill, favorites
 ├── shared/
 │    ├── ui/          # атомы/молекулы
 │    ├── hooks/       # useDebounce, useLocalStorage ...
 │    └── lib/         # helpers, constants
 └── index.tsx
public/
 db/
  ├── skills.json
  └── users.json


```

## 5. Работа со стилями

Проект использует **CSS Modules** для изоляции стилей компонентов.

### Основные правила

- Каждый компонент имеет свой собственный файл стилей с расширением `.module.css`
- Название файла стилей **обязательно** совпадает с названием компонента (регистр важен)

Примеры правильного именования:
components/Header/Header.tsx
components/Header/Header.module.css
features/AuthForm/AuthForm.tsx
features/AuthForm/AuthForm.module.css
pages/HomePage/HomePage.tsx
pages/HomePage/HomePage.module.css
text- **Запрещено**:

- глобальные стили в `index.css` / `App.css` (кроме reset/normalize и глобальных переменных)
- использование обычных `.css` файлов для компонентов
- импорт стилей без `.module` в названии файла

### Пример структуры и кода

```tsx
// src/components/Button/Button.tsx
import styles from './Button.module.css';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
}: ButtonProps) {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${styles[size]}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
CSS/* src/components/Button/Button.module.css */

.button {
  font-family: inherit;
  font-weight: 500;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

```

### Как обычно происходит создание проекта
Этап 1 — UI Kit

Создаются все компоненты.

Button
Input
Checkbox
Avatar
Tag
Card
Modal

Этап 2 — Layout

Создаются части страницы:

Header
Sidebar
CardsGrid


Этап 3 — Страницы

Собирается интерфейс.

Например:

HomePage
ProfilePage
SearchPage


Этап 4 — Логика

Теперь подключается:
API (у нас мок данные)
состояние
фильтры
поиск
авторизация




### 1 Неделя: UI KIT

UI Kit — это библиотека интерфейсных компонентов. 
То есть мы делаем строительные блоки:

-кнопки
-инпуты
-чекбоксы
-карточки
-модалки
-теги
-аватары

Без бизнес-логики.
Храним компоненты в src/shared/ui

Пример компонента:

<Button variant="primary">
  Регистрация
</Button>

Кнопка просто отображается и реагирует на hover / click.

UI Kit — это не весь сверстанный проект, а набор переиспользуемых компонентов, из которых потом собираются страницы.
