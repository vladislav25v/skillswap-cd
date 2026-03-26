import React, { useCallback, useEffect, useMemo, useState } from 'react';
import FormField from '@/shared/ui/FormField';
import Input from '@/shared/ui/Input';
import Textarea from '@/shared/ui/Textarea';
import Button from '@/shared/ui/Button/Button.tsx';
import SkillPicturesPicker from '@/widgets/SkillPicturesPicker';
import styles from './RegStep3Form.module.css';
import clsx from 'clsx';
import { getCategories, getSubcategories } from '@/api';
import type { Category } from '@/entities/category/types.ts';
import type { Subcategory } from '@/entities/subcategory/types.ts';
import { Select, type SelectOption } from '@/shared/ui/Select';
import { useNavigate } from 'react-router-dom';

export interface RegStep3FormProps {
  className?: string;
  onSubmit: (data: SkillFormDataToApprove) => void;
}

type SkillFormData = {
  name: string;
  categoryId: number | undefined;
  subcategoryId: number | undefined;
  description: string;
  pictures: File[];
};

export type SkillFormDataToApprove = Omit<SkillFormData, 'categoryId' | 'subcategoryId'> & {
  categoryName: string;
  subcategoryName: string;
};

type SkillFormErrors = Record<keyof SkillFormData, string>;

const isSubcategoryValidForCategory = (
  subcategoryId: number | undefined,
  categoryId: number | undefined,
  subcategories: Subcategory[],
) => {
  if (!subcategoryId) {
    return false;
  }

  const subcategory = subcategories.find(({ id }) => id === subcategoryId);

  if (!subcategory) {
    return false;
  }

  if (!categoryId) {
    return true;
  }

  return subcategory.categoryId === categoryId;
};

const RegStep3Form: React.FC<RegStep3FormProps> = ({ className, onSubmit }) => {
  const navigate = useNavigate();
  const [skillFormData, setSkillFormData] = useState<SkillFormData>({
    name: '',
    categoryId: undefined,
    subcategoryId: undefined,
    description: '',
    pictures: [],
  });

  const [skillFormErrors, setSkillFormErrors] = useState<SkillFormErrors>({
    name: '',
    categoryId: '',
    subcategoryId: '',
    description: '',
    pictures: '',
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

  useEffect(() => {
    const fetchData = () => {
      return Promise.all([getCategories(), getSubcategories()]);
    };

    fetchData().then(([categoriesData, subcategoriesData]) => {
      setCategories(categoriesData);
      setSubcategories(subcategoriesData);
    });
  }, []);

  const categoryOptions: SelectOption<number>[] = useMemo(() => {
    return categories.map(({ id, name }) => ({ value: id, label: name }));
  }, [categories]);

  const subcategoryOptions: SelectOption<number>[] = useMemo(() => {
    return subcategories
      .filter(({ categoryId }) => {
        if (!skillFormData.categoryId) return true;

        return categoryId === skillFormData.categoryId;
      })
      .map(({ id, name }) => ({ value: id, label: name }));
  }, [skillFormData.categoryId, subcategories]);

  const validateForm = useCallback(
    (data: SkillFormData): SkillFormErrors => {
      const errors: SkillFormErrors = {
        name: '',
        categoryId: '',
        subcategoryId: '',
        description: '',
        pictures: '',
      };

      if (!data.name.trim()) errors.name = 'Р’РІРµРґРёС‚Рµ РЅР°Р·РІР°РЅРёРµ РЅР°РІС‹РєР°';
      if (!data.categoryId) errors.categoryId = 'Р’С‹Р±РµСЂРёС‚Рµ РєР°С‚РµРіРѕСЂРёСЋ';
      if (!data.subcategoryId) {
        errors.subcategoryId = 'Р’С‹Р±РµСЂРёС‚Рµ РїРѕРґРєР°С‚РµРіРѕСЂРёСЋ';
      } else if (
        !isSubcategoryValidForCategory(data.subcategoryId, data.categoryId, subcategories)
      ) {
        errors.subcategoryId = 'Р’С‹Р±РµСЂРёС‚Рµ РїРѕРґС…РѕРґСЏС‰СѓСЋ РїРѕРґРєР°С‚РµРіРѕСЂРёСЋ';
      }
      if (!data.description.trim()) errors.description = 'Р’РІРµРґРёС‚Рµ РѕРїРёСЃР°РЅРёРµ';
      if (!data.pictures.length)
        errors.pictures = 'Р”РѕР±Р°РІСЊС‚Рµ С…РѕС‚СЏ Р±С‹ РѕРґРЅРѕ РёР·РѕР±СЂР°Р¶РµРЅРёРµ';

      return errors;
    },
    [subcategories],
  );

  const handleNameChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setSkillFormData((prev) => ({ ...prev, name: evt.target.value }));
    setSkillFormErrors((prev) => ({ ...prev, name: '' }));
  };

  const handleDescriptionChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSkillFormData((prev) => ({ ...prev, description: evt.target.value }));
    setSkillFormErrors((prev) => ({ ...prev, description: '' }));
  };

  const handleCategoryChange = (value: number | number[]) => {
    const categoryId = Array.isArray(value) ? value[0] : value;
    setSkillFormData((prev) => ({
      ...prev,
      categoryId,
      subcategoryId: undefined,
    }));
    setSkillFormErrors((prev) => ({ ...prev, categoryId: '', subcategoryId: '' }));
  };

  const handleSubcategoryChange = (value: number | number[]) => {
    const subcategoryId = Array.isArray(value) ? value[0] : value;
    setSkillFormData((prev) => ({ ...prev, subcategoryId }));
    setSkillFormErrors((prev) => ({ ...prev, subcategoryId: '' }));
  };

  const handleSkillPictureChange = useCallback((pictures: File[]) => {
    setSkillFormData((prev) => ({ ...prev, pictures }));
    setSkillFormErrors((prev) => ({ ...prev, pictures: '' }));
  }, []);

  const handleBackClick = () => {
    navigate('/register/step-2', { replace: true });
  };

  const handleSubmitForm = (evt: React.SubmitEvent<HTMLFormElement>) => {
    evt.preventDefault();

    const errors = validateForm(skillFormData);
    setSkillFormErrors(errors);

    const hasErrors = Object.values(errors).some((error) => error !== '');
    if (hasErrors) return;

    const mapDataToAproveData = (data: SkillFormData): SkillFormDataToApprove => {
      return {
        ...data,
        categoryName:
          categories.find((category) => {
            return category.id === data.categoryId;
          })?.name ?? '',
        subcategoryName:
          subcategories.find((subcategory) => {
            return subcategory.id === data.subcategoryId;
          })?.name ?? '',
      };
    };

    onSubmit(mapDataToAproveData(skillFormData));
  };

  return (
    <form className={clsx(styles.form, className)} onSubmit={handleSubmitForm}>
      <div className={styles.formContent}>
        <FormField label="РќР°Р·РІР°РЅРёРµ РЅР°РІС‹РєР°" error={skillFormErrors.name}>
          <Input
            name="skillName"
            value={skillFormData.name}
            placeholder="Р’РІРµРґРёС‚Рµ РЅР°Р·РІР°РЅРёРµ РІР°С€РµРіРѕ РЅР°РІС‹РєР°"
            onChange={handleNameChange}
          />
        </FormField>

        <FormField label="РљР°С‚РµРіРѕСЂРёСЏ РЅР°РІС‹РєР°" error={skillFormErrors.categoryId}>
          <Select<number>
            value={skillFormData.categoryId}
            options={categoryOptions}
            onChange={handleCategoryChange}
          />
        </FormField>

        <FormField
          label="РџРѕРґРєР°С‚РµРіРѕСЂРёСЏ РЅР°РІС‹РєР°"
          error={skillFormErrors.subcategoryId}
        >
          <Select<number>
            value={skillFormData.subcategoryId}
            options={subcategoryOptions}
            onChange={handleSubcategoryChange}
          />
        </FormField>

        <FormField label="РћРїРёСЃР°РЅРёРµ" error={skillFormErrors.description}>
          <Textarea
            value={skillFormData.description}
            placeholder="РљРѕСЂРѕС‚РєРѕ РѕРїРёС€РёС‚Рµ, С‡РµРјСѓ РјРѕР¶РµС‚Рµ РЅР°СѓС‡РёС‚СЊ"
            onChange={handleDescriptionChange}
          />
        </FormField>

        <FormField error={skillFormErrors.pictures}>
          <SkillPicturesPicker onFilesChange={handleSkillPictureChange} />
        </FormField>
      </div>

      <div className={styles.formActions}>
        <Button className={styles.formBtn} variant="secondary" onClick={handleBackClick}>
          РќР°Р·Р°Рґ
        </Button>
        <Button className={styles.formBtn} type="submit">
          РџСЂРѕРґРѕР»Р¶РёС‚СЊ
        </Button>
      </div>
    </form>
  );
};

export default RegStep3Form;
