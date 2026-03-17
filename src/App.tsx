import { Edit3 } from 'lucide-react';
import { useEffect, useState } from 'react';
import './App.css';
import type { Category } from '@/entities/category/types.ts';
import { mapSkillToDetailsViewModel } from '@/entities/skill/lib/map-skill-to-details-view-model.ts';
import type { Skill } from '@/entities/skill/types.ts';
import type { Subcategory } from '@/entities/subcategory/types.ts';
import Button from '@/shared/ui/Button/Button.tsx';
import { SkillDetailsPanel } from '@/widgets/SkillDetailsPanel';

interface DbData {
  skills: Skill[];
  categories: Category[];
  subcategories: Subcategory[];
}

interface SkillMeta {
  categoryName?: string;
  subcategoryName?: string;
}

function resolveSkillMeta(
  skill: Skill,
  categories: Category[],
  subcategories: Subcategory[],
): SkillMeta {
  const subcategory = subcategories.find((item) => item.id === skill.subcategoryId);
  const category = categories.find((item) => item.id === subcategory?.categoryId);

  return {
    categoryName: category?.name,
    subcategoryName: subcategory?.name,
  };
}

function App() {
  const [data, setData] = useState<DbData | null>(null);
  const [isMainFavorite, setIsMainFavorite] = useState(false);
  const [isProposalFavorite, setIsProposalFavorite] = useState(true);

  useEffect(() => {
    fetch('/db/db.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        return response.json() as Promise<DbData>;
      })
      .then((nextData) => setData(nextData))
      .catch((error) => {
        console.error('Не удалось загрузить db.json', error);
      });
  }, []);

  if (!data) {
    return <main className="appLoading">Загрузка...</main>;
  }

  const mainSkill = data.skills[0];
  const secondarySkill = data.skills[5];

  if (!mainSkill || !secondarySkill) {
    return <main className="appLoading">Недостаточно данных для демо.</main>;
  }

  const mainMeta = resolveSkillMeta(mainSkill, data.categories, data.subcategories);
  const secondaryMeta = resolveSkillMeta(secondarySkill, data.categories, data.subcategories);

  const mainViewModel = mapSkillToDetailsViewModel({
    skill: mainSkill,
    categoryName: mainMeta.categoryName,
    subcategoryName: mainMeta.subcategoryName,
    isFavorite: isMainFavorite,
  });

  const proposalViewModel = mapSkillToDetailsViewModel({
    skill: secondarySkill,
    categoryName: secondaryMeta.categoryName,
    subcategoryName: secondaryMeta.subcategoryName,
    headerTitle: 'Ваше предложение',
    headerDescription: 'Пожалуйста, проверьте и подтвердите правильность данных',
    isFavorite: isProposalFavorite,
  });

  return (
    <main className="appShell">
      <div className="appContent">
        <SkillDetailsPanel
          title={mainViewModel.title}
          meta={mainViewModel.meta}
          description={mainViewModel.description}
          images={mainViewModel.images}
          imageAlt={mainViewModel.title}
          showFavoriteButton={true}
          showTopActions={true}
          isFavorite={mainViewModel.isFavorite}
          onFavoriteClick={() => setIsMainFavorite((current) => !current)}
          actions={<Button>Обмен предложен</Button>}
        />

        <SkillDetailsPanel
          headerTitle={proposalViewModel.headerTitle}
          headerDescription={proposalViewModel.headerDescription}
          title={proposalViewModel.title}
          meta={proposalViewModel.meta}
          description={proposalViewModel.description}
          images={proposalViewModel.images}
          imageAlt={proposalViewModel.title}
          showFavoriteButton={false}
          isFavorite={proposalViewModel.isFavorite}
          onFavoriteClick={() => setIsProposalFavorite((current) => !current)}
          actions={
            <>
              <Button variant="secondary">
                Редактировать
                <Edit3 />
              </Button>
              <Button>Готово</Button>
            </>
          }
        />
      </div>
    </main>
  );
}

export default App;
