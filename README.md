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
fix: исправлен отступ у блока Services
refactor: переименованы переменные в utils/helpers

```
Запушь ветку:Bashgit 
```
push -u origin feature/add-footer
```
Запушь ветку:Bashgit push -u origin feature/add-footer

4. Code Review & слияние

Все изменения в develop вливаются только через Pull Request
PR должен быть проверен и одобрен тимлидом или его заместителем
Запрещено:
```
git push --force в main / develop
git merge --no-ff в main / develop
```

## 4. Архитектура проекта - FSD

```
  src/
 ├ app          # инициализация, провайдеры, глобальные стили
 │  ├ providers
 │  └ router
 │
 ├ pages         # главная, профайл, skill, favorites
 │  └ UsersPage
 │
 ├ widgets        # готовые фич-блоки (SkillCard, FiltersBar)
 │  └ UsersTable
 │
 ├ features       # пользовательские действия 
 │  ├ edit-user
 │  └ delete-user
 │
 ├ entities       # бизнес-сущности
 │  └ user
 │
 └ shared    # переиспользуемый код без бизнес-логики
    ├ ui
    ├ hooks 
    └ api


```
#### Структура внутри slice

Обычно выглядит так:
```
feature/
 ├ ui
 ├ model
 ├ api
 ├ lib
 ├ config
 └ types
```

**Не обязательно использовать все — только нужные**
- **ui** - Компоненты интерфейса, здесь нет бизнес логики
```
ui/
 ├ EditUserForm.tsx
 └ EditUserButton.tsx
```
- **model** - Бизнес логика и состояние

Тут находится:
- Redux slices
- selectors
- thunks
- state

```
model/
 ├ slice.ts
 ├ selectors.ts
 └ thunks.ts
```
- **types** - типы TS

- **lib** - вспомогательные функции 

```
lib/
 └ formatUserName.ts
```

### Реальный пример feature

```
features/edit-user
 ├ ui
 │   └ EditUserForm.tsx
 │
 ├ model
 │   ├ slice.ts
 │   └ thunks.ts
 │
 ├ api
 │   └ updateUser.ts
 │
 └ types
     └ types.ts
```


### Реальный пример entity

```
entities/user
 ├ ui
 │   └ UserCard.tsx
 │
 ├ model
 │   ├ slice.ts
 │   └ selectors.ts
 │
 ├ api
 │   └ getUser.ts
 │
 └ types
     └ user.ts
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
#### Этап 1 — UI Kit

**Создаются все компоненты:**

- Button
- Input
- Checkbox
- Avatar
- Tag
- Card
- Modal

#### Этап 2 — Layout

**Создаются части страницы:**

- Header
- Sidebar
- CardsGrid


#### Этап 3 — Страницы

**Собирается интерфейс**

Например:

- HomePage
- ProfilePage
- SearchPage


#### Этап 4 — Логика

**Теперь подключается:**

- API (у нас мок данные)
- состояние
- фильтры
- поиск
- авторизация




### 1 Неделя: UI KIT

**UI Kit** — это библиотека интерфейсных компонентов. 
_То есть мы делаем строительные блоки_:

- кнопки
- инпуты
- чекбоксы
- карточки
- модалки
- теги
- аватары

** Без бизнес-логики**
Храним компоненты в src/shared/ui

Пример компонента:

<Button variant="primary">
  Регистрация
</Button>

Кнопка просто отображается и реагирует на hover / click.

**UI Kit** — это не весь сверстанный проект, а набор переиспользуемых компонентов, из которых потом собираются страницы.
