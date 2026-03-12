import { useEffect, useState } from 'react';
import { FilterCheckboxGroup } from '../FilterCheckboxGroup';
import type { FilterOption } from '../FilterCheckboxGroup';
import styles from '../FilterCheckboxGroup.module.css';

interface Category {
  id: number;
  name: string;
}

interface Subcategory {
  id: number;
  categoryId: number;
  name: string;
}

interface DbData {
  categories: Category[];
  subcategories: Subcategory[];
}

const FilterCheckboxGroupDemo = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categoryMapping: Record<
    string,
    'business' | 'art' | 'languages' | 'education' | 'home' | 'health' | 'more'
  > = {
    'Бизнес и карьера': 'business',
    'Творчество и искусство': 'art',
    'Иностранные языки': 'languages',
    'Образование и развитие': 'education',
    'Дом и уют': 'home',
    'Здоровье и лайфстайл': 'health',
    Прочее: 'more', // Добавить категорию "Прочее" в db.json и сопоставить ее с "more"
  };

  useEffect(() => {
    fetch('/db/db.json')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data: DbData) => {
        const hasOtherCategory = data.categories.some((cat) => cat.name === 'Прочее');
        const updatedCategories = [...data.categories];

        if (!hasOtherCategory) {
          const maxCategoryId = Math.max(...data.categories.map((c) => c.id), 0);
          updatedCategories.push({
            id: maxCategoryId + 1,
            name: 'Прочее',
          });
        }

        const otherCategory = updatedCategories.find((cat) => cat.name === 'Прочее');
        const hasOtherSubcategory = data.subcategories.some((sub) => sub.name === 'Другое');
        const updatedSubcategories = [...data.subcategories];

        if (otherCategory && !hasOtherSubcategory) {
          const maxSubcategoryId = Math.max(...data.subcategories.map((s) => s.id), 0);
          updatedSubcategories.push({
            id: maxSubcategoryId + 1,
            categoryId: otherCategory.id,
            name: 'Другое',
          });
        }

        setCategories(updatedCategories);
        setSubcategories(updatedSubcategories);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Ошибка загрузки:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const getFilterOptions = (): FilterOption[] => {
    const sortedCategories = [...categories].sort((a, b) => {
      if (a.name === 'Прочее') return 1;
      if (b.name === 'Прочее') return -1;
      return a.id - b.id;
    });

    let categoriesToShow = sortedCategories;
    if (!showAllCategories) {
      categoriesToShow = sortedCategories.filter((cat) => cat.name !== 'Прочее');
    }

    return categoriesToShow.map((category) => {
      const categorySubcategories = subcategories
        .filter((sub) => sub.categoryId === category.id)
        .map((sub) => ({
          value: `sub-${sub.id}`,
          label: sub.name,
          defaultChecked: false,
          disabled: false,
        }));

      return {
        value: `cat-${category.id}`,
        label: category.name,
        category: categoryMapping[category.name] || 'more',
        subOptions: categorySubcategories.length > 0 ? categorySubcategories : undefined,
        defaultChecked: false,
      };
    });
  };

  const handleSkillsChange = (selected: string[]) => {
    console.log('Выбранные значения:', selected);
  };

  const handleAllCategoriesClick = () => {
    setShowAllCategories(!showAllCategories);
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Загрузка данных...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>
        Ошибка загрузки: {error}
      </div>
    );
  }

  const filterOptions = getFilterOptions();

  return (
    <div
      style={{
        padding: '40px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f5f5f5',
        minHeight: '100vh',
      }}
    >
      <h1 style={{ marginBottom: '40px' }}>Демонстрация FilterCheckboxGroup компонента</h1>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ marginBottom: '20px' }}>Фильтр навыков</h2>
        <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
          <div
            style={{
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              width: '284px',
            }}
          >
            <FilterCheckboxGroup
              title="Навыки"
              name="skills"
              options={filterOptions}
              showAllLink={true}
              allLinkText={
                <span className={styles.filterCheckboxGroup__allLinkContent}>
                  <span>Все категории</span>
                  <span className={styles.filterCheckboxGroup__allLinkIndicator}>
                    <img
                      src="/chevron-down.svg"
                      alt=""
                      className={`${styles.filterCheckboxGroup__allLinkArrow} ${showAllCategories ? styles.filterCheckboxGroup__allLinkArrowUp : ''}`}
                      width="16"
                      height="16"
                    />
                  </span>
                </span>
              }
              onChange={handleSkillsChange}
              onAllLinkClick={handleAllCategoriesClick}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default FilterCheckboxGroupDemo;
