# API

`src/api` содержит transport-слой для работы с моковым API на `json-server`.

## Назначение

API-слой отвечает только за:

- отправку HTTP-запросов
- получение и возврат контракта ответа
- базовую обработку `404 -> null`, где это требуется

Бизнес-логика должна жить выше:

- в `entities` — чистые функции и мапперы
- в `features` — пользовательские действия
- в `pages/widgets` — orchestration и загрузка данных

## Файлы

`config.ts`

- базовый URL API
- использует `VITE_API_BASE_URL`
- fallback на `http://localhost:3001`

`request.ts`

- общий helper для HTTP-запросов
- собирает query params
- отправляет JSON body
- проверяет `response.ok`
- возвращает parsed JSON

`account.ts`

- работа с `accounts`
- поиск аккаунта по `email`
- получение аккаунта по `id`
- создание аккаунта
- обновление аккаунта

`user.ts`

- работа с `users`
- получение списка пользователей
- получение пользователя по `id`
- создание пользователя
- обновление пользователя
- удаление пользователя

`skill.ts`

- `getSkills`
- `getSkillById`

`exchange.ts`

- работа с `exchangeRequests`
- `getExchangeRequests`
- `getExchangeRequestById`
- `createExchangeRequest`
- `updateExchangeRequest`
- `getIncomingExchangeRequests`
- `getOutgoingExchangeRequests`
- `getUserExchanges`

`category.ts`

- `getCategories`

`subcategory.ts`

- `getSubcategories`

`city.ts`

- `getCities`

`index.ts`

- публичный экспорт API-слоя

## Локальный запуск мокового API

```bash
npx json-server --watch public/db/db.json --port 3001
```

## Актуальные коллекции в `db.json`

- `users`
- `accounts`
- `skills`
- `exchangeRequests`
- `categories`
- `subcategories`
- `cities`
