# ExchangeRequest Feature

`features/exchange-request` содержит пользовательские сценарии работы с заявкой на обмен.

## Состав

- `ui/ProposeExchangeButton` — создание заявки на обмен
- `ui/ExchangeRequestActions` — принятие или отклонение входящей заявки
- `ui/CompleteExchangeButton` — завершение обмена
- `lib/hasActiveExchangeDuplicate.ts` — проверка дублирующей активной заявки
- `index.ts` — публичный экспорт feature-слоя

## Сценарии

### ProposeExchangeButton

Что делает:

- проверяет авторизацию
- для неавторизованного пользователя выполняет redirect на `/login`
- не дает отправить заявку самому себе
- проверяет наличие дубликата активной заявки
- создает `exchangeRequest` через API

### ExchangeRequestActions

Что делает:

- рендерит кнопки `Принять` и `Отклонить`
- доступен только автору навыка
- меняет статус заявки:
  - `pending -> in_progress`
  - `pending -> rejected`

### CompleteExchangeButton

Что делает:

- доступен только участникам обмена
- завершает обмен:
  - `in_progress -> completed`
- записывает `completedAt`

## Граница ответственности

Feature-слой:

- использует entity-helper-ы
- вызывает готовый transport-API
- управляет пользовательским действием и локальным UI-состоянием

Feature-слой не хранит:

- глобальное состояние обменов
- доменные типы сущности
- layout страниц профиля
