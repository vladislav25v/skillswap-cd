import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAccountByEmail } from '@/api';
import { useAppDispatch } from '@/app/store/hooks';
import {
  setCurrentStep,
  setRedirectPath,
  setStep1Field,
  validateRegisterStep1,
} from '@/features/auth/register-draft';
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

interface RegPageStep1Props {
  redirectPath?: string;
}

const RegPageStep1: React.FC<RegPageStep1Props> = ({ redirectPath }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  useEffect(() => {
    dispatch(setCurrentStep(1));
    dispatch(setRedirectPath(redirectPath ?? null));
  }, [dispatch, redirectPath]);

  const handleSubmit = async () => {
    if (isCheckingEmail) {
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const nextErrors = validateRegisterStep1({
      email: normalizedEmail,
      password,
      confirmPassword: password,
    });

    setErrors({
      email: nextErrors.email,
      password: nextErrors.password,
    });

    if (nextErrors.email || nextErrors.password) {
      return;
    }

    setIsCheckingEmail(true);

    try {
      const existingAccount = await getAccountByEmail(normalizedEmail);

      if (existingAccount) {
        setErrors({
          email: 'Пользователь с таким email уже существует',
        });
        return;
      }

      dispatch(setStep1Field({ field: 'email', value: normalizedEmail }));
      dispatch(setStep1Field({ field: 'password', value: password }));
      dispatch(setStep1Field({ field: 'confirmPassword', value: password }));
      dispatch(setCurrentStep(2));
      navigate('/register/step-2');
    } finally {
      setIsCheckingEmail(false);
    }
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
            void handleSubmit();
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

          <FormField label="Email" error={errors.email}>
            <Input
              type="email"
              placeholder="Введите email"
              value={email}
              error={errors.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setEmail(e.target.value);
                if (errors.email) {
                  setErrors((prev) => ({ ...prev, email: undefined }));
                }
              }}
            />
          </FormField>

          <FormField
            label="Пароль"
            tip="Пароль должен содержать не менее 8 знаков"
            error={errors.password}
          >
            <PasswordInput
              value={password}
              placeholder="Придумайте надёжный пароль"
              error={errors.password}
              onChange={(value) => {
                setPassword(value);
                if (errors.password) {
                  setErrors((prev) => ({ ...prev, password: undefined }));
                }
              }}
            />
          </FormField>

          <Button type="submit" variant="primary" disabled={isCheckingEmail}>
            {isCheckingEmail ? 'Проверяем...' : 'Далее'}
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
