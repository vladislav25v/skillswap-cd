import type { UserGender } from '@/entities/user/types';

export type RegisterStep = 1 | 2 | 3;

export interface RegisterStep1State {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterStep2State {
  photo: string;
  name: string;
  birthDate: string;
  gender: UserGender | null;
  cityId: number | null;
  learningCategoryId: number | null;
  learningSubcategoryId: number | null;
}

export interface RegisterStep3State {
  teachingSkillTitle: string;
  teachingCategoryId: number | null;
  teachingSubcategoryId: number | null;
  description: string;
  pictures: string[];
}

export interface RegisterDraftMetaState {
  currentStep: RegisterStep;
  isSubmitting: boolean;
  submitError: string | null;
  redirectPath: string | null;
}

export interface RegisterDraftState {
  step1: RegisterStep1State;
  step2: RegisterStep2State;
  step3: RegisterStep3State;
  meta: RegisterDraftMetaState;
}

export const createInitialRegisterDraftState = (): RegisterDraftState => ({
  step1: {
    email: '',
    password: '',
    confirmPassword: '',
  },
  step2: {
    photo: '',
    name: '',
    birthDate: '',
    gender: null,
    cityId: null,
    learningCategoryId: null,
    learningSubcategoryId: null,
  },
  step3: {
    teachingSkillTitle: '',
    teachingCategoryId: null,
    teachingSubcategoryId: null,
    description: '',
    pictures: [],
  },
  meta: {
    currentStep: 1,
    isSubmitting: false,
    submitError: null,
    redirectPath: null,
  },
});
