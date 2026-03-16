import FormField from '@/shared/ui/FormField';
import Input from '@/shared/ui/Input';
import { useState } from 'react';
import Button from '@/shared/ui/Button/Button.tsx';

const ProfilePageForm = () => {
  const [formState, setFormState] = useState({
    email: '',
    password: '',
    password_confirmation: '',
    name: '',
  });

  return (
    <form>
      <FormField label={'Почта'}>
        <Input
          value={formState.email}
          onChange={(e) => setFormState({ ...formState, email: e.target.value })}
          type={'email'}
        />
      </FormField>
      <button type={'button'}>Изменить пароль</button>
      <FormField label={'Имя'}>
        <Input
          value={formState.name}
          onChange={(e) => setFormState({ ...formState, name: e.target.value })}
        />
      </FormField>
      <Button type={'submit'}>Сохранить</Button>
      <pre>{JSON.stringify(formState, null, 2)}</pre>
    </form>
  );
};

export default ProfilePageForm;
