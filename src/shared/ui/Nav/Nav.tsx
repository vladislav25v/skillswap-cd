import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

import type { Category } from '@/entities/category/types';
import type { Subcategory } from '@/entities/subcategory/types';

import { getCategories, getSubcategories } from './DropMenu/api';
import DropMenu, { type MenuSection } from './DropMenu';
import styles from './Nav.module.css';

function Nav() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
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

  const sections = useMemo<MenuSection[]>(
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

  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  return (
    <nav className={styles.navbar}>
      <ul className={styles.navLinks}>
        <li>
          <a className={styles.textNav} href="#about">
            О проекте
          </a>
        </li>
        <li className={styles.dropdownContainer}>
          <button
            ref={triggerRef}
            onClick={toggleDropdown}
            className={`${styles.dropdownTrigger} ${styles.linkButton} ${styles.textNav}`}
            aria-expanded={isDropdownOpen}
            aria-controls="skills-dropdown"
            aria-haspopup="dialog"
            type="button"
          >
            Все навыки <ChevronDown aria-hidden="true" size={16} />
          </button>
          <DropMenu
            isOpen={isDropdownOpen}
            sections={sections}
            onClose={() => setDropdownOpen(false)}
            triggerRef={triggerRef}
            isLoading={isLoading}
            error={error}
          />
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
