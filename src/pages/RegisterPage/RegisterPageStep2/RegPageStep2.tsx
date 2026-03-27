import { useEffect, useMemo, useState } from 'react';
import { ImageDown } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { getCategories, getCities, getSubcategories } from '@/api';
import { AuthLayout } from '@/app/layouts/auth-layout';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import type { Category } from '@/entities/category/types';
import type { City } from '@/entities/city/types';
import type { Subcategory } from '@/entities/subcategory/types';
import type { UserGender } from '@/entities/user/types';
import {
  selectIsRegisterStep1Valid,
  selectRegisterStep2,
  setCurrentStep,
  setStep2Field,
  validateRegisterStep2,
} from '@/features/auth/register-draft';
import { fileToBase64 } from '@/shared/lib/file/fileToBase64';
import Button from '@/shared/ui/Button/Button';
import Datepicker from '@/shared/ui/Datepicker';
import FormField from '@/shared/ui/FormField';
import Input from '@/shared/ui/Input';
import { Select, type SelectOption } from '@/shared/ui/Select';
import AvatarPicker from '@/shared/ui/AvatarPicker';
import AuthInfoCard from '@/widgets/AuthInfoCard';
import bulbIcon from '@/assets/light-bulb.svg';
import styles from './RegPageStep2.module.css';

const genderOptions: SelectOption<UserGender>[] = [
  { value: 'female', label: 'Женский' },
  { value: 'male', label: 'Мужской' },
];

const RegPageStep2 = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const canOpenStep = useAppSelector(selectIsRegisterStep1Valid);
  const step2 = useAppSelector(selectRegisterStep2);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [cities, setCities] = useState<City[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadDictionaries = async () => {
      try {
        const [citiesData, categoriesData, subcategoriesData] = await Promise.all([
          getCities(),
          getCategories(),
          getSubcategories(),
        ]);

        if (!isMounted) {
          return;
        }

        setCities(citiesData);
        setCategories(categoriesData);
        setSubcategories(subcategoriesData);
      } catch {
        // ignore dictionary loading errors in UI
      }
    };

    void loadDictionaries();

    return () => {
      isMounted = false;
    };
  }, []);

  const cityOptions = useMemo<SelectOption<number>[]>(
    () => cities.map((city) => ({ value: city.id, label: city.name })),
    [cities],
  );

  const categoryOptions = useMemo<SelectOption<number>[]>(
    () => categories.map((category) => ({ value: category.id, label: category.name })),
    [categories],
  );

  const subcategoryOptions = useMemo<SelectOption<number>[]>(
    () =>
      subcategories
        .filter((subcategory) =>
          step2.learningCategoryId ? subcategory.categoryId === step2.learningCategoryId : true,
        )
        .map((subcategory) => ({ value: subcategory.id, label: subcategory.name })),
    [step2.learningCategoryId, subcategories],
  );

  if (!canOpenStep) {
    return <Navigate to="/register" replace />;
  }

  const clearFieldError = (field: string) => {
    setErrors((prev) => {
      if (!prev[field]) {
        return prev;
      }

      const nextErrors = { ...prev };
      delete nextErrors[field];
      return nextErrors;
    });
  };

  const handleAvatarChange = async (file: File | null) => {
    if (!file) {
      dispatch(setStep2Field({ field: 'photo', value: '' }));
      return;
    }

    const encodedFile = await fileToBase64(file);
    dispatch(setStep2Field({ field: 'photo', value: encodedFile }));
  };

  const handleCategoryChange = (value: number | number[]) => {
    const nextValue = Array.isArray(value) ? value[0] : value;

    dispatch(setStep2Field({ field: 'learningCategoryId', value: nextValue }));
    dispatch(setStep2Field({ field: 'learningSubcategoryId', value: null }));
    clearFieldError('learningCategoryId');
    clearFieldError('learningSubcategoryId');
  };

  const handleSubcategoryChange = (value: number | number[]) => {
    const nextValue = Array.isArray(value) ? value[0] : value;

    dispatch(setStep2Field({ field: 'learningSubcategoryId', value: nextValue }));
    clearFieldError('learningSubcategoryId');
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateRegisterStep2(step2, subcategories);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    dispatch(setCurrentStep(3));
    navigate('/register/step-3');
  };

  return (
    <AuthLayout
      stepInfo={{ current: 2, total: 3 }}
      leftSlot={
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.avatarBlock}>
            <AvatarPicker
              value={step2.photo}
              size="large"
              onChangeFile={(file) => {
                void handleAvatarChange(file);
              }}
              triggerSlot={
                <button type="button" className={styles.avatarTrigger}>
                  <ImageDown size={18} />
                </button>
              }
            />
          </div>

          <div className={styles.fields}>
            <FormField label="Имя" error={errors.name}>
              <Input
                value={step2.name}
                placeholder="Введите ваше имя"
                onChange={(event) => {
                  dispatch(setStep2Field({ field: 'name', value: event.target.value }));
                  clearFieldError('name');
                }}
              />
            </FormField>

            <div className={styles.row}>
              <FormField label="Дата рождения" error={errors.birthDate}>
                <Datepicker
                  value={step2.birthDate}
                  onChange={(value) => {
                    dispatch(setStep2Field({ field: 'birthDate', value }));
                    clearFieldError('birthDate');
                  }}
                />
              </FormField>

              <FormField label="Пол" error={errors.gender}>
                <Select<UserGender>
                  options={genderOptions}
                  value={step2.gender ?? undefined}
                  placeholder="Выберите пол"
                  onChange={(value) => {
                    const nextValue = Array.isArray(value) ? value[0] : value;
                    dispatch(setStep2Field({ field: 'gender', value: nextValue }));
                    clearFieldError('gender');
                  }}
                />
              </FormField>
            </div>

            <FormField label="Город" error={errors.cityId}>
              <Select<number>
                options={cityOptions}
                value={step2.cityId ?? undefined}
                placeholder="Выберите город"
                onChange={(value) => {
                  const nextValue = Array.isArray(value) ? value[0] : value;
                  dispatch(setStep2Field({ field: 'cityId', value: nextValue }));
                  clearFieldError('cityId');
                }}
              />
            </FormField>

            <FormField
              label="Категория навыка, которому хотите научиться"
              error={errors.learningCategoryId}
            >
              <Select<number>
                options={categoryOptions}
                value={step2.learningCategoryId ?? undefined}
                placeholder="Выберите категорию"
                onChange={handleCategoryChange}
              />
            </FormField>

            <FormField
              label="Подкатегория навыка, которому хотите научиться"
              error={errors.learningSubcategoryId}
            >
              <Select<number>
                options={subcategoryOptions}
                value={step2.learningSubcategoryId ?? undefined}
                placeholder="Выберите подкатегорию"
                onChange={handleSubcategoryChange}
              />
            </FormField>
          </div>

          <div className={styles.actions}>
            <Button
              type="button"
              variant="secondary"
              className={styles.actionButton}
              onClick={() => {
                dispatch(setCurrentStep(1));
                navigate('/register');
              }}
            >
              Назад
            </Button>

            <Button type="submit" className={styles.actionButton}>
              Продолжить
            </Button>
          </div>
        </form>
      }
      rightSlot={
        <AuthInfoCard
          title="Расскажите о себе"
          text="Так мы сможем показать вам подходящие направления обучения уже после завершения регистрации."
          picture={bulbIcon}
          pictureAlt="Лампочка SkillSwap"
        />
      }
    />
  );
};

export default RegPageStep2;
