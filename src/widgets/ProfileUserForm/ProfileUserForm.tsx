import FormField from '@/shared/ui/FormField';
import Input from '@/shared/ui/Input';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Button from '@/shared/ui/Button/Button.tsx';
import PasswordInput from '@/shared/ui/PasswordInput';
import styles from './ProfileUserForm.module.css';
import Textarea from '@/shared/ui/Textarea';
import { ImageDown, PencilLine } from 'lucide-react';
import { Select, type SelectOption } from '@/shared/ui/Select';
import type { City } from '@/entities/city/types.ts';
import Datepicker from '@/shared/ui/Datepicker';
import AvatarPicker from '@/shared/ui/AvatarPicker';
import { fileToBase64 } from '@/shared/lib/file/fileToBase64.ts';
import type { UserGender } from '@/entities/user/types.ts';
import clsx from 'clsx';

interface ProfileUser {
  email: string;
  password: string;
  name: string;
  birthDate: string;
  gender: UserGender | undefined;
  cityId: number | undefined;
  about: string;
  avatar: string;
}

export interface ProfileUserFormProps {
  className?: string;
}

const profileUser: ProfileUser = {
  email: 'mariia@gmail.com',
  password: '',
  name: 'Мария',
  birthDate: '1995-10-28',
  gender: 'female',
  cityId: 1,
  about:
    'Люблю учиться новому, особенно если это можно делать за чаем и в пижаме. Всегда готова пообщаться и обменяться чем‑то интересным!',
  avatar: '',
};

const genderOptions: SelectOption<UserGender>[] = [
  { value: 'female', label: 'Женский' },
  { value: 'male', label: 'Мужской' },
];

const ProfileUserForm: React.FC<ProfileUserFormProps> = ({ className }) => {
  const [initialState] = useState<ProfileUser>(() => {
    const profileUserFromStorage = localStorage.getItem('profileUser');

    return profileUserFromStorage ? JSON.parse(profileUserFromStorage) : profileUser;
  });
  const [formState, setFormState] = useState<ProfileUser>({ ...initialState });
  const [visiblePasswordField, setVisiblePasswordField] = useState(false);
  const [cityOptions, setCityOptions] = useState<SelectOption<number>[]>([]);
  const passwordInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (visiblePasswordField) {
      passwordInputRef.current?.focus();
    }
  }, [visiblePasswordField]);

  const isFormChanged = useMemo(() => {
    return (
      initialState.email !== formState.email ||
      initialState.password !== formState.password ||
      initialState.name !== formState.name ||
      initialState.birthDate !== formState.birthDate ||
      initialState.gender !== formState.gender ||
      initialState.cityId !== formState.cityId ||
      initialState.about !== formState.about ||
      initialState.avatar !== formState.avatar
    );
  }, [initialState, formState]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/db/db.json');
      const data = await response.json();

      return data.cities;
    };

    fetchData()
      .then((cities: City[]) => {
        setCityOptions(cities.map((city: City) => ({ value: city.id, label: city.name })));
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleChangePassword = () => {
    setVisiblePasswordField(true);
  };

  const handleOnChangeFile = async (file: File | null) => {
    if (!file) return;
    setFormState({ ...formState, avatar: await fileToBase64(file) });
  };

  const submitForm = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    localStorage.setItem('profileUser', JSON.stringify(formState));
    alert('Данные сохранены в LocalStorage');
  };

  const handleGenderChange = (value: UserGender | UserGender[]) => {
    const selectedGender = Array.isArray(value) ? value[0] : value;
    setFormState({ ...formState, gender: selectedGender });
  };

  const handleCityChange = (value: number | number[]) => {
    const selectedCityId = Array.isArray(value) ? value[0] : value;
    setFormState({ ...formState, cityId: selectedCityId });
  };

  return (
    <form className={clsx(styles.form, className)} onSubmit={submitForm}>
      <div className={styles.formAvatar}>
        <AvatarPicker
          value={formState.avatar}
          size={'large'}
          onChangeFile={handleOnChangeFile}
          triggerSlot={
            <button className={styles.triggerBtn} type={'button'}>
              <ImageDown />
            </button>
          }
        />
      </div>

      <div className={styles.formContent}>
        <div className={styles.formFields}>
          <FormField label={'Почта'}>
            <Input
              value={formState.email}
              onChange={(e) => setFormState({ ...formState, email: e.target.value })}
              type={'email'}
              rightSlot={<PencilLine className={styles.icon} />}
            />
          </FormField>

          {visiblePasswordField ? (
            <FormField label={'Пароль'}>
              <PasswordInput
                ref={passwordInputRef}
                value={formState.password}
                onChange={(password) => setFormState({ ...formState, password })}
              />
            </FormField>
          ) : (
            <button
              className={styles.changePasswordBtn}
              type={'button'}
              onClick={handleChangePassword}
            >
              Изменить пароль
            </button>
          )}

          <FormField label={'Имя'}>
            <Input
              value={formState.name}
              onChange={(e) => setFormState({ ...formState, name: e.target.value })}
              rightSlot={<PencilLine className={styles.icon} />}
            />
          </FormField>

          <div className={styles.formRow}>
            <FormField
              label={'Дата рождения'}
              className={clsx(styles.formRowItem, styles.formRowItemHalf)}
            >
              <Datepicker
                value={formState.birthDate}
                onChange={(e) => setFormState({ ...formState, birthDate: e })}
              />
            </FormField>

            <FormField label={'Пол'} className={clsx(styles.formRowItem, styles.formRowItemHalf)}>
              <Select<UserGender>
                name="gender"
                size={'standard'}
                options={genderOptions}
                value={formState.gender}
                onChange={handleGenderChange}
              />
            </FormField>
          </div>

          <FormField label={'Город'}>
            <Select<number>
              name="city"
              options={cityOptions}
              value={formState.cityId}
              onChange={handleCityChange}
            />
          </FormField>

          <FormField label={'О себе'}>
            <Textarea
              name={'about'}
              value={formState.about}
              onChange={(e) => setFormState({ ...formState, about: e.target.value })}
              rightSlot={<PencilLine className={styles.icon} />}
            />
          </FormField>
        </div>

        <Button type={'submit'} disabled={!isFormChanged}>
          Сохранить
        </Button>
      </div>
    </form>
  );
};

export default ProfileUserForm;
