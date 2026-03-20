import FormField from '@/shared/ui/FormField';
import Input from '@/shared/ui/Input';
import React, { useEffect, useState } from 'react';
import Button from '@/shared/ui/Button/Button.tsx';
import PasswordInput from '@/shared/ui/PasswordInput';
import styles from './ProfilePageForm.module.css';
import Textarea from '@/shared/ui/Textarea';
import { ImageDown, PencilLine } from 'lucide-react';
import { Select, type SelectOption } from '@/shared/ui/Select';
import type { City } from '@/entities/city/types.ts';
import Datepicker from '@/shared/ui/Datepicker';
import AvatarPicker from '@/shared/ui/AvatarPicker';
import { fileToBase64 } from '@/shared/lib/file/fileToBase64.ts';

interface FormDate {
  email: string;
  password: string;
  name: string;
  birthDate: Date | null;
  gender: string;
  city: string;
  about: string;
  avatar: string;
}

const ProfilePageForm = () => {
  const [formState, setFormState] = useState<FormDate>({
    email: '',
    password: '',
    name: '',
    birthDate: new Date(),
    gender: '',
    city: '',
    about: '',
    avatar: '',
  });
  const [visiblePasswordField, setVisiblePasswordField] = useState(false);
  const [cityOptions, setCityOptions] = useState<SelectOption[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/db/db.json');
      const data = await response.json();

      return data.cities;
    };

    fetchData()
      .then((cities: City[]) => {
        setCityOptions(
          cities.map((city: City) => ({ value: city.id.toString(), label: city.name })),
        );
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const genderOptions: SelectOption[] = [
    {
      value: 'Женский',
      label: 'Женский',
    },
    {
      value: 'Мужской',
      label: 'Мужской',
    },
  ];

  const handleChangePassword = () => {
    setVisiblePasswordField(true);
  };

  const handleOnChangeFile = async (file: File | null) => {
    if (!file) return;
    setFormState({ ...formState, avatar: await fileToBase64(file) });
  };

  const submitForm = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert(JSON.stringify(formState, null, 2));
  };

  return (
    <form className={styles.form} onSubmit={submitForm}>
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
              className={[styles.formRowItem, styles.formRowItemHalf].join(' ')}
            >
              <Datepicker
                value={formState.birthDate}
                onChange={(e) => setFormState({ ...formState, birthDate: e })}
              />
            </FormField>

            <FormField
              label={'Пол'}
              className={[styles.formRowItem, styles.formRowItemHalf].join(' ')}
            >
              <Select
                name="gender"
                size={'standard'}
                options={genderOptions}
                value={formState.gender}
                onChange={(e) => setFormState({ ...formState, gender: e })}
              />
            </FormField>
          </div>

          <FormField label={'Город'}>
            <Select
              name="city"
              options={cityOptions}
              value={formState.city}
              onChange={(e) => {
                setFormState({ ...formState, city: e });
              }}
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

        <Button type={'submit'}>Сохранить</Button>
        <pre style={{ wordBreak: 'break-all', whiteSpace: 'pre-line' }}>
          {JSON.stringify(formState, null, 2)}
        </pre>
      </div>
    </form>
  );
};

export default ProfilePageForm;
