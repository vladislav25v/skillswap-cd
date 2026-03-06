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

