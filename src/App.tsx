import { useEffect, useMemo, useRef, useState } from 'react';

import type { Category } from './entities/category/types';
import type { Subcategory } from './entities/subcategory/types';
import Nav from './shared/ui/Nav/Nav';
import DropMenu, { type MenuSection } from './shared/ui/Nav/DropMenu';
import { getCategories, getSubcategories } from './shared/ui/Nav/DropMenu/api';
import './App.css';

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadMenuData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [categoriesData, subcategoriesData] = await Promise.all([
          getCategories(),
          getSubcategories(),
        ]);

        if (!isMounted) {
          return;
        }

        setCategories(categoriesData);
        setSubcategories(subcategoriesData);
      } catch {
        if (!isMounted) {
          return;
        }

        setError('Не удалось загрузить список навыков.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadMenuData();

    return () => {
      isMounted = false;
    };
  }, []);

  const testSections = useMemo<MenuSection[]>(
    () =>
      categories.map((category) => ({
        id: category.id,
        title: category.name,
        items: subcategories
          .filter((subcategory) => Number(subcategory.categoryId) === Number(category.id))
          .map((subcategory) => ({
            id: Number(subcategory.id),
            name: subcategory.name,
          })),
      })),
    [categories, subcategories],
  );

  return (
    <main className="app">
      <div className="app__navTest">
        <Nav />
      </div>

      <div className="app__menuTest">
        <DropMenu
          isOpen={isOpen}
          sections={testSections}
          onClose={() => setIsOpen(false)}
          triggerRef={triggerRef}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </main>
  );
}

export default App;
