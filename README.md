# React + TypeScript + Vite
Правила работы с репозиторием


1. Основные ветки
main — стабильная ветка, содержит только готовый к продакшену код.
develop — основная ветка для разработки. Никакие изменения не вносятся напрямую — только через Pull Request (PR).
2. Работа над задачами — через отдельные ветки
Каждая новая задача выполняется в новой ветке, созданной от develop.
Формат названия ветки:
<тип>/<короткое-описание-задачи>

Примеры:
feature/add-header
fix/fix-button-alignment
refactor/cleanup-home-page
docs/update-readme

Используемые типы веток:
feature/ — новая фича или компонент
fix/ — исправление бага
refactor/ — улучшение существующего кода без изменения функционала
docs/ — изменения в документации
chore/ — служебные обновления (зависимости, конфиги и т.д.)

3. Как работать над задачей
Перейди в develop:
git checkout develop
git pull    # стянуть актуальный код develop (делается перед каждым выполнением задачи)


Создай ветку для задачи:
git checkout -b feature/add-footer  # пример


Сделай коммиты по ходу работы. Формат коммита (по возможности Conventional Commits):
feat: добавлен компонент Footer
fix: поправлен отступ у блока Services

После завершения работы — запушь ветку:
git push -u origin feature/add-footer


Открой Pull Request в GitHub: из ветки feature/... → в ветку develop
4. Code review
Все изменения вливаются в develop только через PR тимлидом или его заместителем.
Запрещено использовать --force и merge --no-ff в develop




Архитекура проекта: 
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

State-manager: Redux Toolkit
Тесты: Jest + React Testing Library; цель — ≥ 70 % statements покрытия ядра.
Branching: Trunk Based Flow (main → feature/* → PR → merge); линт + юниты в CI.
Коммит-мессаджи: Conventional Commits.






This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
