import type { RegisterDraftState } from './types';
import { createInitialRegisterDraftState } from './types';

const REGISTER_DRAFT_STORAGE_KEY = 'skillswap_register_draft';

type PersistedRegisterDraftState = Omit<RegisterDraftState, 'step1'> & {
  step1: Pick<RegisterDraftState['step1'], 'email'>;
};

const isBrowser = () => typeof window !== 'undefined';

const sanitizeRegisterDraftState = (state: RegisterDraftState): PersistedRegisterDraftState => ({
  ...state,
  step1: {
    email: state.step1.email,
  },
});

const isEmptyDraft = (state: RegisterDraftState) => {
  const initial = createInitialRegisterDraftState();

  return (
    state.step1.email === initial.step1.email &&
    state.step2.photo === initial.step2.photo &&
    state.step2.name === initial.step2.name &&
    state.step2.birthDate === initial.step2.birthDate &&
    state.step2.gender === initial.step2.gender &&
    state.step2.cityId === initial.step2.cityId &&
    state.step2.learningCategoryId === initial.step2.learningCategoryId &&
    state.step2.learningSubcategoryId === initial.step2.learningSubcategoryId &&
    state.step3.teachingSkillTitle === initial.step3.teachingSkillTitle &&
    state.step3.teachingCategoryId === initial.step3.teachingCategoryId &&
    state.step3.teachingSubcategoryId === initial.step3.teachingSubcategoryId &&
    state.step3.description === initial.step3.description &&
    state.step3.pictures.length === 0 &&
    state.meta.redirectPath === initial.meta.redirectPath
  );
};

export const loadStoredRegisterDraft = (): RegisterDraftState => {
  const initialState = createInitialRegisterDraftState();

  if (!isBrowser()) {
    return initialState;
  }

  try {
    const rawValue = window.sessionStorage.getItem(REGISTER_DRAFT_STORAGE_KEY);

    if (!rawValue) {
      return initialState;
    }

    const parsed = JSON.parse(rawValue) as Partial<PersistedRegisterDraftState>;

    return {
      ...initialState,
      step1: {
        ...initialState.step1,
        email: parsed.step1?.email ?? initialState.step1.email,
      },
      step2: {
        ...initialState.step2,
        ...parsed.step2,
      },
      step3: {
        ...initialState.step3,
        ...parsed.step3,
      },
      meta: {
        ...initialState.meta,
        currentStep: parsed.meta?.currentStep ?? initialState.meta.currentStep,
        redirectPath: parsed.meta?.redirectPath ?? initialState.meta.redirectPath,
      },
    };
  } catch {
    return initialState;
  }
};

export const saveStoredRegisterDraft = (state: RegisterDraftState) => {
  if (!isBrowser()) {
    return;
  }

  try {
    if (isEmptyDraft(state)) {
      window.sessionStorage.removeItem(REGISTER_DRAFT_STORAGE_KEY);
      return;
    }

    window.sessionStorage.setItem(
      REGISTER_DRAFT_STORAGE_KEY,
      JSON.stringify(sanitizeRegisterDraftState(state)),
    );
  } catch {
    // ignore storage errors
  }
};

export const clearStoredRegisterDraft = () => {
  if (!isBrowser()) {
    return;
  }

  try {
    window.sessionStorage.removeItem(REGISTER_DRAFT_STORAGE_KEY);
  } catch {
    // ignore storage errors
  }
};
