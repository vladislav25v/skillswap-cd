# SkillPage

`SkillPage` — страница детального просмотра навыка.

## Роут

Страница открывается по маршруту:

```text
/skills/:skillId
```

`skillId` берется из `useParams`, после чего страница загружает данные из `json-server`.

## Композиция страницы

Страница использует уже существующие модули проекта:

- `Header`
- `Footer`
- `SectionBlock`
- `UserCard`
- `SkillDetailsPanel`
- `UsersListSection`
- `ProposeExchangeButton`

Структура экрана:

1. верхний блок: `UserCard` + `SkillDetailsPanel`
2. нижний блок: `SectionBlock`
3. внутри него: `UsersListSection`
4. внутри `UsersListSection`: список `UserCard`

## Источник данных

Страница загружает:

- `skill` через `getSkillById`
- список `skills`
- список `users`
- `cities`
- `subcategories`
- `categories`

## Как собираются данные

Для сборки данных под UI используются pure helper-ы:

- `findSkillOwner` — поиск владельца навыка через `users.createdSkillIds`
- `mapSkillToPageViewModel` — сборка полной модели страницы
- `mapUserToUserCardViewModel` — подготовка данных под `UserCard`
- `mapSkillToDetailsViewModel` — подготовка данных под `SkillDetailsPanel`

## Обмен навыками

Кнопка `Предложить обмен` использует реальные:

- `skillId`
- `ownerUserId`

из загруженной модели страницы.

Если пользователь не авторизован, feature-кнопка отправляет его на `/login` с возвратом назад после входа.

## Состояния

Страница обрабатывает:

- загрузку
- ошибку
- отсутствие навыка

## Похожие предложения

Блок `Похожие предложения` формируется из пользователей, у которых есть навыки с той же `subcategoryId`, что и у текущего навыка.
