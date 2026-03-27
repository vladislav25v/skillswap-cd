import { configureStore } from '@reduxjs/toolkit';
import { filtersReducer } from '@/features/filters';
import {
  loadStoredRegisterDraft,
  registerDraftReducer,
  saveStoredRegisterDraft,
} from '@/features/auth/register-draft';

export const store = configureStore({
  reducer: {
    filters: filtersReducer,
    registerDraft: registerDraftReducer,
  },
  preloadedState: {
    registerDraft: loadStoredRegisterDraft(),
  },
});

store.subscribe(() => {
  saveStoredRegisterDraft(store.getState().registerDraft);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
