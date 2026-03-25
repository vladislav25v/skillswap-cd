import React, { useState } from 'react';
import { AuthLayout } from '@/app/layouts/auth-layout';
import FormField from '@/shared/ui/FormField';
import Input from '@/shared/ui/Input';
import Button from '@/shared/ui/Button/Button';
import styles from './RegPageStep1.module.css';

import GoogleIcon from '@/assets/RegPages/Google.svg';
import AppleIcon from '@/assets/RegPages/Apple.svg';
import PasswordInput from '@/shared/ui/PasswordInput';
import AuthInfoCard from '@/widgets/AuthInfoCard';
import bulbIcon from '@/assets/light-bulb.svg';

const RegPageStep1: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    console.log('Регистрация:', { email, password });
  };

  return (
    <AuthLayout
      stepInfo={{
        current: 1,
        total: 3,
      }}
      leftSlot={
        <form
          className={styles.formContainer}
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmit();
          }}
        >
          <Button type="button" variant="secondary" className={styles.socialButton}>
            <img src={GoogleIcon} alt="Google" className={styles.socialIcon} />
            Продолжить с Google
          </Button>

          <Button type="button" variant="secondary" className={styles.socialButton}>
            <img src={AppleIcon} alt="Apple" className={styles.socialIcon} />
            Продолжить с Apple
          </Button>

          <div className={styles.divider}>
            <span>или</span>
          </div>

          <FormField label="Email">
            <Input
              type="email"
              placeholder="Введите email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            />
          </FormField>

          <FormField label="Пароль" tip="Пароль должен содержать не менее 8 знаков">
            <PasswordInput
              value={password}
              placeholder="Придумайте надёжный пароль"
              onChange={setPassword}
            />
          </FormField>

          <Button type="submit" variant="primary">
            Далее
          </Button>
        </form>
      }
      rightSlot={
        <AuthInfoCard
          title="Добро пожаловать в SkillSwap!"
          text="Присоединяйтесь к SkillSwap и обменивайтесь знаниями и навыками с другими людьми"
          picture={bulbIcon}
          pictureAlt="Лампочка SkillSwap"
        />
      }
    />
  );
};

export default RegPageStep1;
