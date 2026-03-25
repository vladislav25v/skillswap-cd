# ExchangeRequest Entity

`exchange-request` описывает доменную сущность заявки на обмен навыками.

## Состав

- `types.ts` — контракт сущности `ExchangeRequest`
- `index.ts` — публичный экспорт entity-слоя
- `lib/canUserRespondToExchange.ts` — проверка, может ли текущий пользователь принять или отклонить заявку
- `lib/canUserCompleteExchange.ts` — проверка, может ли текущий пользователь завершить обмен
- `lib/isExchangeActive.ts` — определение активного статуса заявки
- `lib/getExchangeStatusLabel.ts` — человекочитаемое название статуса

## Статусы

- `pending` — ожидает решения автора навыка
- `in_progress` — заявка принята, обмен в процессе (в будещем открывается доступ в чат)
- `rejected` — заявка отклонена
- `completed` — обмен завершен (чат закрывается)

## Поля сущности

- `id`
- `skillId`
- `ownerUserId`
- `requesterUserId`
- `status`
- `createdAt`
- `respondedAt`
- `completedAt`

## Граница ответственности

Entity-слой хранит только:

- типы заявки
- чистые функции для работы со статусами и ролями участников

Entity-слой не выполняет:

- HTTP-запросы
- redirect
- показ уведомлений
- прямую работу с React UI
