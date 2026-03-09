# Input

## Пропсы

```ts
interface InputProps {
  value: string;
  name?: string;
  id?: string;
  placeholder?: string;
  error?: string;
  type?: 'text' | 'password' | 'search' | 'email';
  bordered?: boolean;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
```

| Пропс         | Обязательный | Тип                                                | Значение по умолчанию | Описание                                                                                                      |
|---------------|--------------|----------------------------------------------------|-----------------------|---------------------------------------------------------------------------------------------------------------|
| `value`       | ✅            | `string`                                           |                       | значение атрибута `value`                                                                                     |
| `name`        | ❌            | `string`                                           | `undefined`           | значение атрибута `name`                                                                                      |
| `id`          | ❌            | `string`                                           | `undefined`           | значение атрибута `id`                                                                                        |
| `placeholder` | ❌            | `string`                                           | `undefined`           | значение атрибута `placeholder`                                                                               |
| `disabled`    | ❌            | `boolean`                                          | `undefined`           | значение атрибута `disabled`                                                                                  |
| `error`       | ❌            | `string`                                           | `undefined`           | текст с ошибкой, если значение есть, дробавляет красную рамку                                                 |
| `type`        | ❌            | `'text \| 'password' \| 'search' \| 'email'`       | `text`                | значение атрибута `type`                                                                                      |
| `bordered`    | ❌            | `boolean`                                          | `true`                | отбражает рамку                                                                                               |
| `leftSlot`    | ❌            | `React.ReactNode`                                  | `undefined`           | слот для левой части инпута<br/> (напр. иконка лупы в поле поиска)                                            |
| `rightSlot`   | ❌            | `React.ReactNode`                                  | `undefined`           | слот для парвой части инпута<br/>(напр. иконка показа/скрытия пароля, иконка крестика для очистки поля ввода) |
| `onChange`    | ❌            | `(e: React.ChangeEvent<HTMLInputElement>) => void` | `undefined`           | обработчик события ввода                                                                                      |
| `ref`         | ❌            | `HTMLInputElement`                                 |                       | ссылка на элемент `<input>` в компоненте                                                                      |

## Ref

Принимает ref чтобы можно было работать с инпутом из родительского компонента. Например, поставить фокус:

```jsx
const inputRef = useRef < HTMLInputElement | null > (null);

useEffect(() => {
  inputRef.current?.focus()
}, [])

return (
  <>
    <Input ref={inputRef} value="Some value" />
  </>
)
```
