# Providers

## AuthProvider

`AuthProvider` хранит текущее состояние авторизации приложения.

Что делает:

- хранит `session`, `account`, `user`, `isAuthenticated`, `isLoading`
- восстанавливает сессию из `localStorage` при старте приложения
- реализует `login`, `register`, `logout`, `updateProfile`, `restoreSession`
- очищает битую или неподтверждённую сессию

## auth-context

`auth-context.ts` описывает контракт авторизации:

- shape состояния
- сигнатуры методов
- хук `useAuth()`

`useAuth()` должен вызываться только внутри `AuthProvider`.
