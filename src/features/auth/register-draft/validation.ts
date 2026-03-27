import type { Subcategory } from '@/entities/subcategory/types';
import type {
  RegisterDraftState,
  RegisterStep,
  RegisterStep1State,
  RegisterStep2State,
  RegisterStep3State,
} from './types';

export type RegisterStep1Errors = Partial<Record<keyof RegisterStep1State, string>>;
export type RegisterStep2Errors = Partial<Record<keyof RegisterStep2State, string>>;
export type RegisterStep3Errors = Partial<Record<keyof RegisterStep3State, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isSubcategoryInCategory = (
  subcategoryId: number | null,
  categoryId: number | null,
  subcategories?: Subcategory[],
) => {
  if (!subcategoryId || !categoryId || !subcategories) {
    return true;
  }

  const subcategory = subcategories.find((item) => item.id === subcategoryId);

  return Boolean(subcategory && subcategory.categoryId === categoryId);
};

export const validateRegisterStep1 = (step1: RegisterStep1State): RegisterStep1Errors => {
  const errors: RegisterStep1Errors = {};

  if (!step1.email.trim()) {
    errors.email = 'Введите email';
  } else if (!EMAIL_PATTERN.test(step1.email.trim())) {
    errors.email = 'Укажите корректный email';
  }

  if (!step1.password) {
    errors.password = 'Введите пароль';
  } else if (step1.password.length < 8) {
    errors.password = 'Пароль должен содержать не менее 8 символов';
  }

  if (!step1.confirmPassword) {
    errors.confirmPassword = 'Повторите пароль';
  } else if (step1.confirmPassword !== step1.password) {
    errors.confirmPassword = 'Пароли не совпадают';
  }

  return errors;
};

export const validateRegisterStep2 = (
  step2: RegisterStep2State,
  subcategories?: Subcategory[],
): RegisterStep2Errors => {
  const errors: RegisterStep2Errors = {};

  if (!step2.name.trim()) {
    errors.name = 'Введите имя';
  }

  if (!step2.birthDate) {
    errors.birthDate = 'Укажите дату рождения';
  }

  if (!step2.gender) {
    errors.gender = 'Выберите пол';
  }

  if (!step2.cityId) {
    errors.cityId = 'Выберите город';
  }

  if (!step2.learningCategoryId) {
    errors.learningCategoryId = 'Выберите категорию';
  }

  if (!step2.learningSubcategoryId) {
    errors.learningSubcategoryId = 'Выберите подкатегорию';
  } else if (
    !isSubcategoryInCategory(step2.learningSubcategoryId, step2.learningCategoryId, subcategories)
  ) {
    errors.learningSubcategoryId = 'Подкатегория не относится к выбранной категории';
  }

  return errors;
};

export const validateRegisterStep3 = (
  step3: RegisterStep3State,
  subcategories?: Subcategory[],
): RegisterStep3Errors => {
  const errors: RegisterStep3Errors = {};

  if (!step3.teachingSkillTitle.trim()) {
    errors.teachingSkillTitle = 'Введите название навыка';
  }

  if (!step3.teachingCategoryId) {
    errors.teachingCategoryId = 'Выберите категорию';
  }

  if (!step3.teachingSubcategoryId) {
    errors.teachingSubcategoryId = 'Выберите подкатегорию';
  } else if (
    !isSubcategoryInCategory(step3.teachingSubcategoryId, step3.teachingCategoryId, subcategories)
  ) {
    errors.teachingSubcategoryId = 'Подкатегория не относится к выбранной категории';
  }

  if (!step3.description.trim()) {
    errors.description = 'Введите описание';
  }

  return errors;
};

const hasErrors = (errors: Record<string, string | undefined>) =>
  Object.values(errors).some(Boolean);

export const isRegisterStep1Valid = (step1: RegisterStep1State) =>
  !hasErrors(validateRegisterStep1(step1));

export const isRegisterStep2Valid = (step2: RegisterStep2State) =>
  !hasErrors(validateRegisterStep2(step2));

export const isRegisterStep3Valid = (step3: RegisterStep3State) =>
  !hasErrors(validateRegisterStep3(step3));

export const getFirstIncompleteRegisterStep = (state: RegisterDraftState): RegisterStep => {
  if (!isRegisterStep1Valid(state.step1)) {
    return 1;
  }

  if (!isRegisterStep2Valid(state.step2)) {
    return 2;
  }

  if (!isRegisterStep3Valid(state.step3)) {
    return 3;
  }

  return 3;
};
