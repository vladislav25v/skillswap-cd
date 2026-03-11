import {
  BookOpenText,
  BriefcaseBusiness,
  Globe,
  House,
  Leaf,
  Palette,
  type LucideIcon,
} from 'lucide-react';
import { useEffect, useRef, type RefObject } from 'react';

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

type SectionCardProps = {
  section: MenuSection;
};

function SectionCard({ section }: SectionCardProps) {
  const Icon = sectionIcons[section.id] ?? BriefcaseBusiness;
  const toneClass = sectionToneClasses[section.id] ?? '';

  return (
    <section className={styles.section}>
      <span className={`${styles.iconWrap} ${toneClass}`} aria-hidden="true">
        <Icon className={styles.icon} />
      </span>
      <div className={styles.sectionBody}>
        <h3 className={styles.sectionTitle}>{section.title}</h3>
        <ul className={styles.list}>
          {section.items.map((item) => (
            <li key={item.id} className={styles.listItem}>
              <button type="button" className={styles.linkButton}>
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
  const menuRef = useRef<HTMLDivElement | null>(null);
  const leftColumnSections = sections.filter((_, index) => index % 2 === 0);
  const rightColumnSections = sections.filter((_, index) => index % 2 !== 0);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
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
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      id="skills-dropdown"
      ref={menuRef}
      className={styles.menu}
      role="dialog"
      aria-label="Меню навыков"
    >
      {isLoading && <p className={styles.status}>Загрузка навыков...</p>}
      {error && !isLoading && <p className={styles.status}>{error}</p>}
      {!isLoading && !error && (
        <div className={styles.sections}>
          <div className={styles.column}>
            {leftColumnSections.map((section) => (
              <SectionCard key={section.id} section={section} />
            ))}
          </div>
          <div className={styles.column}>
            {rightColumnSections.map((section) => (
              <SectionCard key={section.id} section={section} />
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
