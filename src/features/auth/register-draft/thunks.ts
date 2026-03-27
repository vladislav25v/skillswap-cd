import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  createAccount,
  createSkill,
  createUser,
  deleteAccount,
  deleteSkill,
  deleteUser,
  getAccountByEmail,
  getSubcategories,
  updateUser,
} from '@/api';
import { setStoredSession } from '@/features/auth/auth-storage';
import type { RootState } from '@/app/store';
import type { Account } from '@/entities/account/types';
import type { Skill } from '@/entities/skill/types';
import type { User } from '@/entities/user/types';
import { validateRegisterStep1, validateRegisterStep2, validateRegisterStep3 } from './validation';

export const submitRegistration = createAsyncThunk<
  void,
  void,
  { state: RootState; rejectValue: string }
>('registerDraft/submitRegistration', async (_, { getState, rejectWithValue }) => {
  const state = getState().registerDraft;
  const normalizedEmail = state.step1.email.trim().toLowerCase();

  if (Object.keys(validateRegisterStep1({ ...state.step1, email: normalizedEmail })).length > 0) {
    return rejectWithValue('Заполните первый шаг регистрации');
  }

  const subcategories = await getSubcategories();

  if (Object.keys(validateRegisterStep2(state.step2, subcategories)).length > 0) {
    return rejectWithValue('Заполните второй шаг регистрации');
  }

  if (Object.keys(validateRegisterStep3(state.step3, subcategories)).length > 0) {
    return rejectWithValue('Заполните третий шаг регистрации');
  }

  const existingAccount = await getAccountByEmail(normalizedEmail);

  if (existingAccount) {
    return rejectWithValue('Пользователь с таким email уже существует');
  }

  let createdUser: User | null = null;
  let createdAccount: Account | null = null;
  let createdSkill: Skill | null = null;

  try {
    createdUser = await createUser({
      name: state.step2.name.trim(),
      birthDate: state.step2.birthDate,
      cityId: state.step2.cityId ?? 0,
      photo: state.step2.photo,
      about: '',
      gender: state.step2.gender ?? 'female',
      registeredAt: new Date().toISOString(),
      likes: 0,
      desiredSubcategoryIds: state.step2.learningSubcategoryId
        ? [state.step2.learningSubcategoryId]
        : [],
      createdSkillIds: [],
      favoriteSkillIds: [],
    });

    createdAccount = await createAccount({
      email: normalizedEmail,
      password: state.step1.password,
      userId: createdUser.id,
      createdAt: new Date().toISOString(),
    });

    createdSkill = await createSkill({
      title: state.step3.teachingSkillTitle.trim(),
      subcategoryId: state.step3.teachingSubcategoryId ?? 0,
      description: state.step3.description.trim(),
      images: state.step3.pictures,
      createdAt: new Date().toISOString(),
      likes: 0,
    });

    await updateUser(createdUser.id, {
      createdSkillIds: [createdSkill.id],
    });

    setStoredSession({
      accountId: createdAccount.id,
      userId: createdUser.id,
    });
  } catch {
    if (createdSkill) {
      try {
        await deleteSkill(createdSkill.id);
      } catch {
        // ignore rollback error
      }
    }

    if (createdAccount) {
      try {
        await deleteAccount(createdAccount.id);
      } catch {
        // ignore rollback error
      }
    }

    if (createdUser) {
      try {
        await deleteUser(createdUser.id);
      } catch {
        // ignore rollback error
      }
    }

    return rejectWithValue('Не удалось завершить регистрацию');
  }
});
