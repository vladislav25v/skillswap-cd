# API

`src/api` содержит минимальный transport-слой для работы с моковым API.

## Файлы

`config.ts`
- базовый URL API
- использует `VITE_API_BASE_URL` с fallback на `http://localhost:3001`

`category.ts`
- `getCategories`

`subcategory.ts`
- `getSubcategories`

`city.ts`
- `getCities`

`request.ts`
- общий helper для HTTP-запросов
- собирает query params
- отправляет JSON body
- возвращает parsed JSON

`account.ts`
- методы для `accounts`
- поиск аккаунта по `email`
- получение аккаунта по `id`
- создание аккаунта
- обновление аккаунта

`user.ts`
- методы для `users`
- получение пользователя по `id`
- создание пользователя
- обновление профиля
- удаление пользователя для rollback регистрации

`index.ts`
- общий публичный экспорт API-слоя

## Граница ответственности

`src/api` отвечает только за запросы и контракт ответа.

Бизнес-логика выше:
- `AuthProvider` решает, когда логинить пользователя
- `features/auth` описывает типы и формат сессии
