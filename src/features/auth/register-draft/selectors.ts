import type { RootState } from '@/app/store';
import {
  getFirstIncompleteRegisterStep,
  isRegisterStep1Valid,
  isRegisterStep2Valid,
  isRegisterStep3Valid,
} from './validation';

export const selectRegisterDraft = (state: RootState) => state.registerDraft;
export const selectRegisterStep1 = (state: RootState) => state.registerDraft.step1;
export const selectRegisterStep2 = (state: RootState) => state.registerDraft.step2;
export const selectRegisterStep3 = (state: RootState) => state.registerDraft.step3;
export const selectRegisterMeta = (state: RootState) => state.registerDraft.meta;
export const selectRegisterRedirectPath = (state: RootState) =>
  state.registerDraft.meta.redirectPath;

export const selectIsRegisterStep1Valid = (state: RootState) =>
  isRegisterStep1Valid(state.registerDraft.step1);

export const selectIsRegisterStep2Valid = (state: RootState) =>
  isRegisterStep2Valid(state.registerDraft.step2);

export const selectIsRegisterStep3Valid = (state: RootState) =>
  isRegisterStep3Valid(state.registerDraft.step3);

export const selectFirstIncompleteRegisterStep = (state: RootState) =>
  getFirstIncompleteRegisterStep(state.registerDraft);
