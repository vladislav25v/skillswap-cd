import { useLayoutEffect, useRef, useState } from 'react';
import type { Skill } from '@/entities/skill/types';
import type { Subcategory } from '@/entities/subcategory/types';
import type { User } from '@/entities/user/types';
import styles from './Skilltags.module.css';

type SkillTagCategory = 'business' | 'art' | 'languages' | 'education' | 'home' | 'health';

interface SkillTagItem {
  id: number | string;
  label: string;
  category: SkillTagCategory;
}

type UserSkillData = Pick<User, 'createdSkillIds' | 'desiredSubcategoryIds'>;
type SkillData = Pick<Skill, 'id' | 'title' | 'subcategoryId'>;
type SubcategoryData = Pick<Subcategory, 'id' | 'name' | 'categoryId'>;

interface SkilltagsProps {
  teachingSkills: SkillTagItem[];
  learningSkills: SkillTagItem[];
  maxVisibleTags?: number;
  className?: string;
}

const categoryMap: Record<number, SkillTagCategory> = {
  1: 'business',
  2: 'art',
  3: 'languages',
  4: 'education',
  5: 'home',
  6: 'health',
};

const createUserSkillTags = ({
  user,
  skills,
  subcategories,
}: {
  user: UserSkillData;
  skills: SkillData[];
  subcategories: SubcategoryData[];
}): { teachingSkills: SkillTagItem[]; learningSkills: SkillTagItem[] } => {
  const subcategoriesById = new Map(
    subcategories.map((subcategory) => [subcategory.id, subcategory]),
  );
  const skillsById = new Map(skills.map((skill) => [skill.id, skill]));

  const teachingSkills = user.createdSkillIds
    .map((skillId) => skillsById.get(skillId))
    .filter((skill): skill is SkillData => Boolean(skill))
    .map((skill) => {
      const subcategory = subcategoriesById.get(skill.subcategoryId);

      return {
        id: skill.id,
        label: skill.title,
        category: categoryMap[subcategory?.categoryId ?? 4] ?? 'education',
      };
    });

  const learningSkills = user.desiredSubcategoryIds
    .map((subcategoryId) => subcategoriesById.get(subcategoryId))
    .filter((subcategory): subcategory is SubcategoryData => Boolean(subcategory))
    .map((subcategory) => ({
      id: `desired-${subcategory.id}`,
      label: subcategory.name,
      category: categoryMap[subcategory.categoryId] ?? 'education',
    }));

  return { teachingSkills, learningSkills };
};

const SkillsTags = ({
  teachingSkills,
  learningSkills,
  maxVisibleTags,
  className = '',
}: SkilltagsProps) => {
  const sections = [
    { title: 'Может научить:', skills: teachingSkills },
    { title: 'Хочет научиться:', skills: learningSkills },
  ];
  const [visibleCounts, setVisibleCounts] = useState<number[]>([]);
  const rowRefs = useRef<Array<HTMLDivElement | null>>([]);
  const tagMeasureRefs = useRef<Array<Array<HTMLSpanElement | null>>>([]);
  const counterMeasureRefs = useRef<Array<HTMLSpanElement | null>>([]);

  useLayoutEffect(() => {
    const getVisibleCount = (sectionIndex: number) => {
      const section = sections[sectionIndex];
      const row = rowRefs.current[sectionIndex];

      if (!section || !row || section.skills.length === 0) {
        return 0;
      }

      const maxByProp = maxVisibleTags ?? section.skills.length;
      const allowedCount = Math.min(section.skills.length, Math.max(maxByProp, 0));

      if (allowedCount === 0) {
        return 0;
      }

      const rowStyles = window.getComputedStyle(row);
      const gap = Number.parseFloat(rowStyles.columnGap || rowStyles.gap || '0') || 0;
      const rowWidth = row.clientWidth;
      const sectionTagRefs = tagMeasureRefs.current[sectionIndex] ?? [];
      const counterRef = counterMeasureRefs.current[sectionIndex];

      let usedWidth = 0;
      let fittedCount = 0;

      for (let i = 0; i < allowedCount; i += 1) {
        const tagWidth = sectionTagRefs[i]?.offsetWidth ?? 0;
        const nextUsedWidth = fittedCount === 0 ? tagWidth : usedWidth + gap + tagWidth;
        const hiddenAfterCurrent = section.skills.length - (i + 1);
        let requiredWidth = nextUsedWidth;

        if (hiddenAfterCurrent > 0 && counterRef) {
          counterRef.textContent = `+${hiddenAfterCurrent}`;
          requiredWidth += gap + counterRef.offsetWidth;
        }

        if (requiredWidth <= rowWidth) {
          usedWidth = nextUsedWidth;
          fittedCount = i + 1;
          continue;
        }

        break;
      }

      return fittedCount > 0 ? fittedCount : 1;
    };

    const recalculate = () => {
      setVisibleCounts(sections.map((_, index) => getVisibleCount(index)));
    };

    const frameId = window.requestAnimationFrame(recalculate);
    const resizeObserver = new ResizeObserver(recalculate);

    rowRefs.current.forEach((row) => {
      if (row) {
        resizeObserver.observe(row);
      }
    });

    window.addEventListener('resize', recalculate);

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      window.removeEventListener('resize', recalculate);
    };
  }, [teachingSkills, learningSkills, maxVisibleTags]);

  return (
    <div className={`${styles.container} ${className}`.trim()}>
      {sections.map((section, sectionIndex) => {
        const fallbackCount = Math.min(
          section.skills.length,
          maxVisibleTags ?? section.skills.length,
        );
        const visibleCount = visibleCounts[sectionIndex] ?? fallbackCount;
        const visibleSkills = section.skills.slice(0, visibleCount);
        const hiddenSkillsCount = Math.max(section.skills.length - visibleCount, 0);

        return (
          <section key={section.title} className={styles.section}>
            <h3 className={styles.title}>{section.title}</h3>
            <div
              className={styles.tagsRow}
              ref={(element) => {
                rowRefs.current[sectionIndex] = element;
              }}
            >
              {visibleSkills.map((skill) => (
                <span key={skill.id} className={`${styles.tag} ${styles[skill.category]}`}>
                  {skill.label}
                </span>
              ))}
              {hiddenSkillsCount > 0 && (
                <span className={`${styles.tag} ${styles.moreTag}`}>+{hiddenSkillsCount}</span>
              )}
            </div>

            <div className={styles.measureContainer} aria-hidden="true">
              {section.skills.map((skill, skillIndex) => (
                <span
                  key={`measure-${section.title}-${skill.id}`}
                  className={`${styles.tag} ${styles[skill.category]}`}
                  ref={(element) => {
                    if (!tagMeasureRefs.current[sectionIndex]) {
                      tagMeasureRefs.current[sectionIndex] = [];
                    }

                    tagMeasureRefs.current[sectionIndex][skillIndex] = element;
                  }}
                >
                  {skill.label}
                </span>
              ))}
              <span
                className={`${styles.tag} ${styles.moreTag}`}
                ref={(element) => {
                  counterMeasureRefs.current[sectionIndex] = element;
                }}
              >
                +999
              </span>
            </div>
          </section>
        );
      })}
    </div>
  );
};

export { SkillsTags };
export { createUserSkillTags };
export type { SkillTagCategory, SkillTagItem, UserSkillData, SkillData, SubcategoryData };
export default SkillsTags;
