import FormField from '@/shared/ui/FormField';
import Input from '@/shared/ui/Input';
import { useState } from 'react';
import Button from '@/shared/ui/Button/Button.tsx';
import PasswordInput from '@/shared/ui/PasswordInput';
import styles from './ProfilePageForm.module.css';

const ProfilePageForm = () => {
  const [formState, setFormState] = useState({
    email: '',
    password: '',
    password_confirmation: '',
    name: '',
    birthDate: '',
    gender: '',
    city: '',
    about: '',
  });

  return (
    <form className={styles.form}>
      <div className={styles.formContent}>
        <div className={styles.formFields}>
          <FormField label={'Почта'}>
            <Input
              value={formState.email}
              onChange={(e) => setFormState({ ...formState, email: e.target.value })}
              type={'email'}
            />
          </FormField>
          <button type={'button'}>Изменить пароль</button>
          <FormField label={'Пароль'}>
            <PasswordInput
              value={formState.password}
              onChange={(password) => setFormState({ ...formState, password })}
            />
          </FormField>
          <FormField label={'Имя'}>
            <Input
              value={formState.name}
              onChange={(e) => setFormState({ ...formState, name: e.target.value })}
            />
          </FormField>
          <div className={styles.formRow}>
            <FormField
              label={'Дата рождения'}
              className={[styles.formRowItem, styles.formRowItemHalf].join(' ')}
            >
              <Input
                type={'date'}
                value={formState.birthDate}
                onChange={(e) => setFormState({ ...formState, birthDate: e.target.value })}
              />
            </FormField>
            <FormField
              label={'Пол'}
              className={[styles.formRowItem, styles.formRowItemHalf].join(' ')}
            >
              <select
                name=""
                value={formState.gender}
                onChange={(e) => setFormState({ ...formState, gender: e.target.value })}
              >
                <option value="Женский">Женский</option>
                <option value="Мужской">Мужской</option>
              </select>
            </FormField>
          </div>
          <FormField label={'Город'}>
            <select
              value={formState.city}
              onChange={(e) => {
                console.dir(e.target);
                setFormState({ ...formState, city: e.target.value });
              }}
              name=""
            >
              <option value="Москва">Москва</option>
              <option value="Астрахань">Астрахань</option>
            </select>
          </FormField>
          <FormField label={'О себе'}>
            <textarea
              value={formState.about}
              onChange={(e) => setFormState({ ...formState, about: e.target.value })}
            ></textarea>
          </FormField>
        </div>
        <Button type={'submit'}>Сохранить</Button>
        <pre>{JSON.stringify(formState, null, 2)}</pre>
      </div>
      <div className={styles.formAvatar}>2</div>
    </form>
  );
};

export default ProfilePageForm;
