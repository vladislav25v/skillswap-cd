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
}

type SkillFormData = {
  name: string;
  categoryId: number | undefined;
  subcategoryId: number | undefined;
  description: string;
  pictures: File[];
};

type SkillFormErrors = Record<keyof SkillFormData, string>;

const RegStep3Form: React.FC<RegStep3FormProps> = ({ className }) => {
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

  const validateForm = useCallback((data: SkillFormData): SkillFormErrors => {
    const errors: SkillFormErrors = {
      name: '',
      categoryId: '',
      subcategoryId: '',
      description: '',
      pictures: '',
    };

    if (!data.name.trim()) errors.name = 'Введите название навыка';
    if (!data.categoryId) errors.categoryId = 'Выберите категорию';
    if (!data.subcategoryId) errors.subcategoryId = 'Выберите подкатегорию';
    if (!data.subcategoryId) errors.subcategoryId = 'Выберите подкатегорию';
    if (!data.description.trim()) errors.description = 'Введите описание';
    if (!data.pictures.length) errors.pictures = 'Добавьте хотя бы одно изображение';

    return errors;
  }, []);

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
    setSkillFormData((prev) => ({ ...prev, categoryId }));
    setSkillFormErrors((prev) => ({ ...prev, categoryId: '' }));
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

    alert('TODO: Должен отобразиться диалог с введенными данными');
  };

  return (
    <form className={clsx(styles.form, className)} onSubmit={handleSubmitForm}>
      <div className={styles.formContent}>
        <FormField label="Название навыка" error={skillFormErrors.name}>
          <Input
            name="skillName"
            value={skillFormData.name}
            placeholder="Введите название вашего навыка"
            onChange={handleNameChange}
          />
        </FormField>

        <FormField label="Категория навыка" error={skillFormErrors.categoryId}>
          <Select<number>
            value={skillFormData.categoryId}
            options={categoryOptions}
            onChange={handleCategoryChange}
          />
        </FormField>

        <FormField label="Подкатегория навыка" error={skillFormErrors.subcategoryId}>
          <Select<number>
            value={skillFormData.subcategoryId}
            options={subcategoryOptions}
            onChange={handleSubcategoryChange}
          />
        </FormField>

        <FormField label="Описание" error={skillFormErrors.description}>
          <Textarea
            value={skillFormData.description}
            placeholder="Коротко опишите, чему можете научить"
            onChange={handleDescriptionChange}
          />
        </FormField>

        <FormField error={skillFormErrors.pictures}>
          <SkillPicturesPicker onFilesChange={handleSkillPictureChange} />
        </FormField>
      </div>

      <div className={styles.formActions}>
        <Button className={styles.formBtn} variant="secondary" onClick={handleBackClick}>
          Назад
        </Button>
        <Button className={styles.formBtn} type="submit">
          Продолжить
        </Button>
      </div>
    </form>
  );
};

export default RegStep3Form;
