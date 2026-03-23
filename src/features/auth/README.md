# Auth Feature

`src/features/auth` хранит прикладную модель авторизации.

## Файлы

`types.ts`
- типы сессии
- payload-тип логина, регистрации и обновления профиля
- `UiActionResult` для возврата ошибок в UI без сырых `Error`

`config.ts`
- константы auth-слоя
- сейчас здесь хранится ключ `localStorage`: `skillswap_auth`

`auth-storage.ts`
- чтение сессии из `localStorage`
- запись сессии в `localStorage`
- очистка сессии
- базовая валидация структуры `AuthSession`

## Формат сессии

Сессия хранится как JSON:

```ts
type AuthSession = {
  accountId: number;
  userId: number;
};
```

Правила:
- ключ хранения: `skillswap_auth`
- `createdAt` и `expiresAt` не используются
- сессия бессрочная до `logout`
- если сессию не удалось подтвердить, она очищается
