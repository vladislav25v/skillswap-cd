# API

`src/api` содержит transport-слой для работы с моковым API.

## Файлы

`config.ts`
- базовый URL API
- использует `VITE_API_BASE_URL`
- имеет fallback на `http://localhost:3001`

`request.ts`
- общий helper для HTTP-запросов
- собирает query params
- отправляет JSON body
- проверяет `response.ok`
- возвращает parsed JSON

`account.ts`
- методы для `accounts`
- поиск аккаунта по `email`
- получение аккаунта по `id`
- создание аккаунта
- обновление аккаунта

`user.ts`
- методы для `users`
- получение списка пользователей
- получение пользователя по `id`
- создание пользователя
- обновление пользователя
- удаление пользователя

`skill.ts`
- `getSkills`

`category.ts`
- `getCategories`

`subcategory.ts`
- `getSubcategories`

`city.ts`
- `getCities`

`index.ts`
- общий публичный экспорт API-слоя

## Граница ответственности

`src/api` отвечает только за сетевые запросы и контракт ответа.

Бизнес-логика выше:
- страницы и виджеты решают, когда запрашивать данные
- `features` и `entities` преобразуют данные под UI

## Локальный запуск мокового API

```bash
npx json-server --watch public/db/db.json --port 3001
