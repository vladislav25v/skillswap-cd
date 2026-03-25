# ProfilePage

`ProfilePage` — layout для разделов профиля с боковой навигацией и контентной областью.

## Назначение

Компонент используется вместе с `react-router-dom` и предназначен для вложенных маршрутов через `Outlet`.

## Структура

```html
<main class="main">
  <aside class="sidebar">
    <!-- AsideNav -->
  </aside>

  <div class="content">
    <!-- Outlet -->
  </div>
</main>
```

## Авторизация

`ProfilePage` теперь защищает весь раздел `/profile`.

Поведение:

- пока auth-сессия восстанавливается, layout не рендерится
- если пользователь не авторизован, выполняется redirect на `/login`
- в `state.from` передается текущий путь профиля, чтобы после входа вернуть пользователя обратно

Это правило распространяется на все вложенные разделы:

- `/profile`
- `/profile/favorites`
- будущие `/profile/requests`
- будущие `/profile/exchanges`

## Текущие вложенные разделы

- `index` — `ProfileUserForm`
- `favorites` — `ProfileFavorites`

Дополнительные разделы `requests` и `exchanges` должны подключаться как child-routes и автоматически рендериться в `Outlet`.
