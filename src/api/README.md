# API Mock

Для локального мокового API используется `json-server`.

## Установка

```bash
npm install -D json-server
```

## Запуск

```bash
npx json-server --watch public/db/db.json --port 3001
```

Базовый адрес:

```bash
http://localhost:3001
```

## Эндпоинты

- `GET /users`
- `GET /users/:id`
- `GET /skills`
- `GET /skills/:id`
- `POST /skills`
- `PATCH /skills/:id`
- `DELETE /skills/:id`
- `GET /skills?userId=:id`
- `GET /skills?subcategoryId=:id`
- `GET /categories`
- `GET /categories/:id`
- `GET /subcategories`
- `GET /subcategories/:id`
- `GET /subcategories?categoryId=:id`
- `GET /cities`
- `GET /cities/:id`

## CRUD

`json-server` поддерживает `POST`, `PATCH` и `DELETE`.

Пример `POST`:

```js
fetch('http://localhost:3001/skills', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 1,
    title: 'Новый навык',
    subcategoryId: 10,
    description: 'Тестовое описание',
    image: 'https://picsum.photos/400/300',
  }),
});
```

Пример `PATCH`:

```js
fetch('http://localhost:3001/skills/1', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Обновлённый навык',
  }),
});
```

Пример `DELETE`:

```js
fetch('http://localhost:3001/skills/1', {
  method: 'DELETE',
});
```

## Структура данных

В моках используются коллекции:

- `users`
- `skills`
- `categories`
- `subcategories`
- `cities`

users и skills это модели данных которые создаются/редактируются через формы, всё остальное используется для фильтрации и бизнес логики и не должно редактироваться/удаляться/добавляться

## Проверка

Проверить API можно в браузере:

```bash
http://localhost:3001/users
```

Или в консоли браузера:

```js
fetch('http://localhost:3001/users')
  .then((res) => res.json())
  .then(console.log);
```

Интерфейсы разнесены согласно по entities модулям
