import React, { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { ImageDown, PencilLine } from 'lucide-react';
import { useAuth } from '@/app/providers/auth-context';
import type { UpdateAccountPayload, UpdateProfilePayload } from '@/features/auth/types';
import type { City } from '@/entities/city/types';
import type { UserGender } from '@/entities/user/types';
import { getCities } from '@/api';
import FormField from '@/shared/ui/FormField';
import Input from '@/shared/ui/Input';
import Button from '@/shared/ui/Button/Button';
import PasswordInput from '@/shared/ui/PasswordInput';
import Textarea from '@/shared/ui/Textarea';
import { Select, type SelectOption } from '@/shared/ui/Select';
import Datepicker from '@/shared/ui/Datepicker';
import AvatarPicker from '@/shared/ui/AvatarPicker';
import { fileToBase64 } from '@/shared/lib/file/fileToBase64';
import styles from './ProfileUserForm.module.css';

type ProfileUserFormState = {
  email: string;
  password: string;
  name: string;
  birthDate: string;
  gender: UserGender | undefined;
  cityId: number | undefined;
  about: string;
  avatar: string;
};

export interface ProfileUserFormProps {
  className?: string;
}

const genderOptions: SelectOption<UserGender>[] = [
  { value: 'female', label: 'Женский' },
  { value: 'male', label: 'Мужской' },
];

const buildFormState = (
  email: string,
  name: string,
  birthDate: string,
  gender: UserGender | undefined,
  cityId: number | undefined,
  about: string,
  avatar: string,
): ProfileUserFormState => ({
  email,
  password: '',
  name,
  birthDate,
  gender,
  cityId,
  about,
  avatar,
});

const ProfileUserForm: React.FC<ProfileUserFormProps> = ({ className }) => {
  const { user, account, updateAccount, updateProfile, isLoading } = useAuth();

  const initialState = useMemo<ProfileUserFormState | null>(() => {
    if (!user || !account) {
      return null;
    }

    return buildFormState(
      account.email,
      user.name,
      user.birthDate,
      user.gender,
      user.cityId,
      user.about,
      user.photo,
    );
  }, [user, account]);

  const [formState, setFormState] = useState<ProfileUserFormState | null>(initialState);
  const [cityOptions, setCityOptions] = useState<SelectOption<number>[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormState(initialState);
  }, [initialState]);

  useEffect(() => {
    let isMounted = true;

    const loadCities = async () => {
      try {
        const cities = await getCities();

        if (!isMounted) {
          return;
        }

        setCityOptions(cities.map((city: City) => ({ value: city.id, label: city.name })));
      } catch (error) {
        console.error('Failed to load cities', error);
      }
    };

    void loadCities();

    return () => {
      isMounted = false;
    };
  }, []);

  const isAccountChanged = useMemo(() => {
    if (!initialState || !formState) {
      return false;
    }

    return initialState.email !== formState.email || Boolean(formState.password);
  }, [initialState, formState]);

  const isProfileChanged = useMemo(() => {
    if (!initialState || !formState) {
      return false;
    }

    return (
      initialState.name !== formState.name ||
      initialState.birthDate !== formState.birthDate ||
      initialState.gender !== formState.gender ||
      initialState.cityId !== formState.cityId ||
      initialState.about !== formState.about ||
      initialState.avatar !== formState.avatar
    );
  }, [initialState, formState]);

  const isCityIdValid = useMemo(() => {
    if (!formState || formState.cityId === undefined) {
      return false;
    }

    return cityOptions.some((cityOption) => cityOption.value === formState.cityId);
  }, [cityOptions, formState]);

  const canSubmit = (isAccountChanged || (isProfileChanged && isCityIdValid)) && !isSubmitting;

  if (isLoading) {
    return null;
  }

  if (!user || !account || !formState || !initialState) {
    return null;
  }

  const handleOnChangeFile = async (file: File | null) => {
    if (!file) {
      return;
    }

    const avatar = await fileToBase64(file);
    setFormState((prev) => (prev ? { ...prev, avatar } : prev));
  };

  const handleGenderChange = (value: UserGender | UserGender[]) => {
    const selectedGender = Array.isArray(value) ? value[0] : value;

    if (selectedGender !== formState?.gender) {
      alert('Смена пола недоступна в вашем регионе');
    }
  };

  const handleCityChange = (value: number | number[]) => {
    const selectedCityId = Array.isArray(value) ? value[0] : value;
    setFormState((prev) => (prev ? { ...prev, cityId: selectedCityId } : prev));
  };

  const submitForm = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitting(true);

    if (isProfileChanged) {
      const { gender, cityId } = formState;

      if (!gender || cityId === undefined || !isCityIdValid) {
        setIsSubmitting(false);
        return;
      }
    }

    if (isAccountChanged) {
      const accountPayload: UpdateAccountPayload = {};
      const normalizedEmail = formState.email.trim().toLowerCase();

      if (normalizedEmail !== initialState.email) {
        accountPayload.email = normalizedEmail;
      }

      if (formState.password) {
        accountPayload.password = formState.password;
      }

      const accountResult = await updateAccount(accountPayload);

      if (!accountResult.ok) {
        setIsSubmitting(false);
        alert(accountResult.message);
        return;
      }
    }

    if (!isProfileChanged) {
      setIsSubmitting(false);
      setFormState((prev) =>
        prev ? { ...prev, email: prev.email.trim().toLowerCase(), password: '' } : prev,
      );
      alert('Данные аккаунта успешно сохранены');
      return;
    }

    const { gender, cityId } = formState;

    if (!gender || cityId === undefined) {
      setIsSubmitting(false);
      return;
    }

    const payload: UpdateProfilePayload = {
      name: formState.name,
      birthDate: formState.birthDate,
      gender,
      cityId,
      photo: formState.avatar,
      about: formState.about,
    };

    const result = await updateProfile(payload);

    setIsSubmitting(false);

    if (!result.ok) {
      alert(result.message);
      return;
    }

    const nextState = buildFormState(
      formState.email,
      payload.name,
      payload.birthDate,
      payload.gender,
      payload.cityId,
      payload.about,
      payload.photo,
    );

    setFormState({ ...nextState, password: '' });
    alert('Изменения успешно сохранены');
  };

  return (
    <form className={clsx(styles.form, className)} onSubmit={submitForm}>
      <div className={styles.formAvatar}>
        <AvatarPicker
          value={formState.avatar}
          size="large"
          onChangeFile={handleOnChangeFile}
          triggerSlot={
            <button className={styles.triggerBtn} type="button">
              <ImageDown />
            </button>
          }
        />
      </div>

      <div className={styles.formContent}>
        <div className={styles.formFields}>
          <FormField label="Почта">
            <Input
              value={formState.email}
              type="email"
              onChange={(e) => setFormState({ ...formState, email: e.target.value })}
              rightSlot={<PencilLine className={styles.icon} />}
            />
          </FormField>

          <FormField label="Пароль">
            <PasswordInput
              value={formState.password}
              onChange={(password) => setFormState({ ...formState, password })}
              placeholder="Ваш пароль"
            />
          </FormField>

          <FormField label="Имя">
            <Input
              value={formState.name}
              onChange={(e) => setFormState({ ...formState, name: e.target.value })}
              rightSlot={<PencilLine className={styles.icon} />}
            />
          </FormField>

          <div className={styles.formRow}>
            <FormField
              label="Дата рождения"
              className={clsx(styles.formRowItem, styles.formRowItemHalf)}
            >
              <Datepicker
                value={formState.birthDate}
                onChange={(value) => setFormState({ ...formState, birthDate: value })}
              />
            </FormField>

            <FormField label="Пол" className={clsx(styles.formRowItem, styles.formRowItemHalf)}>
              <Select<UserGender>
                name="gender"
                size="standard"
                options={genderOptions}
                value={formState.gender}
                onChange={handleGenderChange}
              />
            </FormField>
          </div>

          <FormField label="Город">
            <Select<number>
              name="city"
              options={cityOptions}
              value={formState.cityId}
              onChange={handleCityChange}
            />
          </FormField>

          <FormField label="О себе">
            <Textarea
              name="about"
              value={formState.about}
              onChange={(e) => setFormState({ ...formState, about: e.target.value })}
              rightSlot={<PencilLine className={styles.icon} />}
            />
          </FormField>
        </div>

        <Button type="submit" disabled={!canSubmit}>
          Сохранить
        </Button>
      </div>
    </form>
  );
};

export default ProfileUserForm;
