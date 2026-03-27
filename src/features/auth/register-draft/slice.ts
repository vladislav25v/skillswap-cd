import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { clearStoredRegisterDraft } from './storage';
import { submitRegistration } from './thunks';
import type { RegisterDraftState } from './types';
import { createInitialRegisterDraftState } from './types';

const initialState = createInitialRegisterDraftState();

const registerDraftSlice = createSlice({
  name: 'registerDraft',
  initialState,
  reducers: {
    setStep1Field: <K extends keyof RegisterDraftState['step1']>(
      state: RegisterDraftState,
      action: PayloadAction<{ field: K; value: RegisterDraftState['step1'][K] }>,
    ) => {
      state.step1[action.payload.field] = action.payload.value;
      state.meta.submitError = null;
    },
    setStep2Field: <K extends keyof RegisterDraftState['step2']>(
      state: RegisterDraftState,
      action: PayloadAction<{ field: K; value: RegisterDraftState['step2'][K] }>,
    ) => {
      state.step2[action.payload.field] = action.payload.value;
      state.meta.submitError = null;
    },
    setStep3Field: <K extends keyof RegisterDraftState['step3']>(
      state: RegisterDraftState,
      action: PayloadAction<{ field: K; value: RegisterDraftState['step3'][K] }>,
    ) => {
      state.step3[action.payload.field] = action.payload.value;
      state.meta.submitError = null;
    },
    setCurrentStep: (state, action: PayloadAction<RegisterDraftState['meta']['currentStep']>) => {
      state.meta.currentStep = action.payload;
    },
    setRedirectPath: (state, action: PayloadAction<string | null>) => {
      state.meta.redirectPath = action.payload;
    },
    resetRegisterDraft: () => createInitialRegisterDraftState(),
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitRegistration.pending, (state) => {
        state.meta.isSubmitting = true;
        state.meta.submitError = null;
      })
      .addCase(submitRegistration.fulfilled, () => {
        clearStoredRegisterDraft();
        return createInitialRegisterDraftState();
      })
      .addCase(submitRegistration.rejected, (state, action) => {
        state.meta.isSubmitting = false;
        state.meta.submitError = action.payload ?? 'Не удалось завершить регистрацию';
      });
  },
});

export const {
  setStep1Field,
  setStep2Field,
  setStep3Field,
  setCurrentStep,
  setRedirectPath,
  resetRegisterDraft,
} = registerDraftSlice.actions;

export default registerDraftSlice.reducer;
