import {
  BookOpenText,
  BriefcaseBusiness,
  Globe,
  House,
  Leaf,
  Palette,
  type LucideIcon,
} from 'lucide-react';
import { useEffect, useRef, useState, type RefObject } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { selectSkills, setFilters } from '@/features/filters';

import styles from './DropMenu.module.css';

export type MenuItem = {
  id: number;
  name: string;
};

export type MenuSection = {
  id: number;
  title: string;
  items: MenuItem[];
};

export type DropMenuProps = {
  isOpen: boolean;
  sections: MenuSection[];
  onClose: () => void;
  triggerRef?: RefObject<HTMLButtonElement | null>;
  isLoading?: boolean;
  error?: string | null;
};

const sectionIcons: Record<number, LucideIcon> = {
  1: BriefcaseBusiness,
  2: Palette,
  3: Globe,
  4: BookOpenText,
  5: House,
  6: Leaf,
};

const sectionToneClasses: Record<number, string> = {
  1: styles.tagBusiness,
  2: styles.tagArt,
  3: styles.tagLanguages,
  4: styles.tagEducation,
  5: styles.tagHome,
  6: styles.tagHealth,
};

const focusableSelector = [
  'button:not([disabled])',
  '[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

type SectionCardProps = {
  section: MenuSection;
  selectedSkills: string[];
  onCategoryClick: (section: MenuSection) => void;
  onSubcategoryClick: (subcategoryId: number) => void;
};

function SectionCard({
  section,
  selectedSkills,
  onCategoryClick,
  onSubcategoryClick,
}: SectionCardProps) {
  const Icon = sectionIcons[section.id] ?? BriefcaseBusiness;
  const toneClass = sectionToneClasses[section.id] ?? '';
  const allItemsSelected =
    section.items.length > 0 &&
    section.items.every((item) => selectedSkills.includes(String(item.id)));
  const anyItemSelected = section.items.some((item) => selectedSkills.includes(String(item.id)));

  return (
    <section className={styles.section}>
      <span className={clsx(styles.iconWrap, toneClass)} aria-hidden="true">
        <Icon className={styles.icon} />
      </span>
      <div className={styles.sectionBody}>
        <button
          type="button"
          className={clsx(styles.sectionTitleButton, {
            [styles.sectionTitleButtonActive]: allItemsSelected || anyItemSelected,
          })}
          onClick={() => onCategoryClick(section)}
        >
          <span className={styles.sectionTitle}>{section.title}</span>
        </button>
        <ul className={styles.list}>
          {section.items.map((item) => (
            <li key={item.id} className={styles.listItem}>
              <button
                type="button"
                className={clsx(styles.linkButton, {
                  [styles.linkButtonActive]: selectedSkills.includes(String(item.id)),
                })}
                onClick={() => onSubcategoryClick(item.id)}
              >
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function DropMenu({
  isOpen,
  sections,
  onClose,
  triggerRef,
  isLoading = false,
  error = null,
}: DropMenuProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const selectedSkills = useAppSelector(selectSkills);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [isMounted, setIsMounted] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);
  const leftColumnSections = sections.filter((_, index) => index % 2 === 0);
  const rightColumnSections = sections.filter((_, index) => index % 2 !== 0);

  const closeAndOpenCatalog = () => {
    onClose();
    navigate('/');
  };

  const handleCategoryClick = (section: MenuSection) => {
    dispatch(
      setFilters({
        mainFilter: 'all',
        skills: section.items.map((item) => String(item.id)),
        authorGender: '',
        cities: [],
      }),
    );

    closeAndOpenCatalog();
  };

  const handleSubcategoryClick = (subcategoryId: number) => {
    dispatch(
      setFilters({
        mainFilter: 'all',
        skills: [String(subcategoryId)],
        authorGender: '',
        cities: [],
      }),
    );
    closeAndOpenCatalog();
  };

  useEffect(() => {
    let frameId: number | null = null;

    if (isOpen) {
      frameId = requestAnimationFrame(() => {
        setIsMounted(true);
      });
    } else {
      frameId = requestAnimationFrame(() => {
        setIsVisible(false);
      });
    }

    return () => {
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isMounted || !isOpen) {
      return undefined;
    }

    let firstFrameId: number | null = null;
    let secondFrameId: number | null = null;

    firstFrameId = requestAnimationFrame(() => {
      setIsVisible(false);

      secondFrameId = requestAnimationFrame(() => {
        setIsVisible(true);
      });
    });

    return () => {
      if (firstFrameId !== null) {
        cancelAnimationFrame(firstFrameId);
      }

      if (secondFrameId !== null) {
        cancelAnimationFrame(secondFrameId);
      }
    };
  }, [isMounted, isOpen]);

  useEffect(() => {
    if (!isMounted) {
      return undefined;
    }

    const focusFirstItem = () => {
      const focusableElements = menuRef.current?.querySelectorAll<HTMLElement>(focusableSelector);
      focusableElements?.[0]?.focus();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        triggerRef?.current?.focus();
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      const focusableElements = menuRef.current?.querySelectorAll<HTMLElement>(focusableSelector);

      if (!focusableElements || focusableElements.length === 0) {
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    const handleDocumentClick = (event: MouseEvent) => {
      const targetNode = event.target as Node;

      if (menuRef.current?.contains(targetNode)) {
        return;
      }

      if (triggerRef?.current?.contains(targetNode)) {
        return;
      }

      onClose();
      triggerRef?.current?.focus();
    };

    const focusFrameId = requestAnimationFrame(() => {
      focusFirstItem();
    });

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleDocumentClick);

    return () => {
      cancelAnimationFrame(focusFrameId);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [isMounted, onClose, triggerRef]);

  if (!isMounted) {
    return null;
  }

  return (
    <div
      id="skills-dropdown"
      ref={menuRef}
      className={clsx(styles.menu, {
        [styles.menuOpen]: isVisible,
        [styles.menuClosed]: !isVisible,
      })}
      role="dialog"
      aria-hidden={!isVisible}
      onTransitionEnd={(event) => {
        if (event.target === event.currentTarget && !isOpen) {
          setIsMounted(false);
        }
      }}
      aria-label="Меню навыков"
    >
      {isLoading && <p className={styles.status}>Загрузка навыков...</p>}
      {error && !isLoading && <p className={styles.status}>{error}</p>}
      {!isLoading && !error && (
        <div className={styles.sections}>
          <div className={styles.column}>
            {leftColumnSections.map((section) => (
              <SectionCard
                key={section.id}
                section={section}
                selectedSkills={selectedSkills}
                onCategoryClick={handleCategoryClick}
                onSubcategoryClick={handleSubcategoryClick}
              />
            ))}
          </div>
          <div className={styles.column}>
            {rightColumnSections.map((section) => (
              <SectionCard
                key={section.id}
                section={section}
                selectedSkills={selectedSkills}
                onCategoryClick={handleCategoryClick}
                onSubcategoryClick={handleSubcategoryClick}
              />
            ))}
          </div>
        </div>
      )}
      {!isLoading && !error && sections.length === 0 && (
        <p className={styles.status}>Список навыков пока пуст.</p>
      )}
    </div>
  );
}

export default DropMenu;
