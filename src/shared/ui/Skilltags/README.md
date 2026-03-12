# SkillsTags

Контейнер для тегов навыков в карточке пользователя.

Компонент рендерит 2 секции:
- `Может научить:`
- `Хочет научиться:`

В каждой секции компонент сам определяет, сколько тегов помещается в доступную ширину строки.
Если тегов больше, справа появляется дополнительный тег-счетчик в формате `+N`.

- на узкой карточке может отображаться `1` тег
- на стандартной `2`
- на широкой `3+`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `teachingSkills` | `SkillTagItem[]` | — | Навыки, которым пользователь может научить |
| `learningSkills` | `SkillTagItem[]` | — | Навыки, которые пользователь хочет изучить |
| `maxVisibleTags` | `number` | `undefined` | Ограничивает максимальное число отображаемых тегов (дополнительно к авторасчету по ширине) |
| `className` | `string` | `''` | Дополнительный CSS-класс контейнера |

## Типы

```ts
export type SkillTagCategory =
  | 'business'
  | 'art'
  | 'languages'
  | 'education'
  | 'home'
  | 'health';

export interface SkillTagItem {
  id: number | string;
  label: string;
  category: SkillTagCategory;
}
```

## Цвета тегов по категории

Цвет фона определяется через глобальные CSS-переменные из `src/index.css`:
- `business` -> `--color-tag-business`
- `art` -> `--color-tag-art`
- `languages` -> `--color-tag-languages`
- `education` -> `--color-tag-education`
- `home` -> `--color-tag-home`
- `health` -> `--color-tag-health`
- тег счетчика `+N` -> `--color-tag-more`

## Пример использования в UserCard

```tsx
import { SkillsTags, type SkillTagItem } from '@/shared/ui/Skilltags';

const teachingSkills: SkillTagItem[] = [
  { id: 1, label: 'Игра на барабанах', category: 'art' },
  { id: 2, label: 'Тайм-менеджмент', category: 'business' },
  { id: 3, label: 'Медитация', category: 'health' },
];

const learningSkills: SkillTagItem[] = [
  { id: 11, label: 'Тайм-менеджмент', category: 'business' },
  { id: 12, label: 'Медитация', category: 'health' },
  { id: 13, label: 'Английский', category: 'languages' },
];

<SkillsTags teachingSkills={teachingSkills} learningSkills={learningSkills} />;
```

## Подготовка данных для UserCard

Для карточки пользователя можно использовать helper `createUserSkillTags` из этого же модуля.

```ts
import { SkillsTags, createUserSkillTags } from '@/shared/ui/Skilltags';

const { teachingSkills, learningSkills } = createUserSkillTags({
  user,
  skills,
  subcategories,
});

<SkillsTags teachingSkills={teachingSkills} learningSkills={learningSkills} />;
```

Логика helper:

- `users.createdSkillIds` -> найти соответствующие записи в `skills`
- для каждого `skill.subcategoryId` найти `subcategory`
- по `subcategory.categoryId` определить категорию и привести к `SkillTagCategory`
- `users.desiredSubcategoryIds` -> найти `subcategories`, взять `name` как текст тега
- для `desiredSubcategoryIds` категория также определяется через `subcategory.categoryId`
