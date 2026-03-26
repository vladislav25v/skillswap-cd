import { Link } from 'react-router-dom';
import { useState, useRef, useEffect, useMemo } from 'react';
import { Logo } from '@/shared/ui/Logo/Logo';
import styles from './Footer.module.css';
import { getCategories, getSubcategories } from '@/api';
import DropMenu, { type MenuSection } from '@/shared/ui/Nav/DropMenu';
import type { Category } from '@/entities/category/types';
import type { Subcategory } from '@/entities/subcategory/types';

interface FooterProps {
  copyrightText?: string;
  showLogo?: boolean;
}

const navColumns = [
  {
    items: [
      { id: 'about', label: 'О проекте', to: '/about' },
      { id: 'all-skills', label: 'Все навыки', to: '/skills' },
    ],
  },
  {
    items: [
      { id: 'contacts', label: 'Контакты', to: '/contacts' },
      { id: 'blog', label: 'Блог', to: '/blog' },
    ],
  },
  {
    items: [
      { id: 'privacy', label: 'Политика конфиденциальности', to: '/privacy' },
      { id: 'terms', label: 'Пользовательское соглашение', to: '/terms' },
    ],
  },
];

export const Footer = ({
  copyrightText = `SkillSwap – ${new Date().getFullYear()}`,
  showLogo = true,
}: FooterProps) => {
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

        if (!isMounted) return;

        setCategories(categoriesData);
        setSubcategories(subcategoriesData);
      } catch {
        if (!isMounted) return;
        setError('Не удалось загрузить список навыков.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadMenuData();

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
    setDropdownOpen((prev) => !prev);
  };

  const handleSkillsClick = async (e: React.MouseEvent) => {
    e.preventDefault();

    const headerSkillsButton = document.querySelector(
      '[data-skills-button="header"]',
    ) as HTMLButtonElement;

    if (headerSkillsButton) {
      headerSkillsButton.scrollIntoView({ behavior: 'smooth', block: 'start' });

      setTimeout(() => {
        headerSkillsButton.click();
      }, 500);
    } else {
      toggleDropdown();
    }
  };

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.container}>
        <div className={styles.logoSection}>
          {showLogo && (
            <Link to="/" className={styles.logoLink}>
              <Logo />
            </Link>
          )}
          <span className={styles.copyright}>{copyrightText}</span>
        </div>

        <nav className={styles.navSection} aria-label="Нижняя навигация">
          {navColumns.map((column, colIndex) => (
            <ul key={colIndex} className={styles.column}>
              {column.items.map((item) => (
                <li key={item.id} className={styles.navItem}>
                  {item.label === 'Все навыки' ? (
                    <button
                      ref={triggerRef}
                      onClick={handleSkillsClick}
                      className={styles.skillsButton}
                      aria-expanded={isDropdownOpen}
                      aria-haspopup="dialog"
                      type="button"
                    >
                      {item.label}
                    </button>
                  ) : (
                    <Link to={item.to} className={styles.navLink}>
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          ))}
        </nav>
      </div>

      {/* DropMenu вынесен за пределы footer, чтобы не зависеть от позиционирования */}
      <DropMenu
        isOpen={isDropdownOpen}
        sections={sections}
        onClose={() => setDropdownOpen(false)}
        triggerRef={triggerRef}
        isLoading={isLoading}
        error={error}
      />
    </footer>
  );
};
