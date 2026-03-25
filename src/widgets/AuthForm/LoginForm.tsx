import { useMemo, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '@/shared/ui/Button/Button';
import Input from '@/shared/ui/Input';
import FormField from '@/shared/ui/FormField';
import { useAuth } from '@/app/providers/auth-context';
import googleIcon from '@/assets/google.svg';
import appleIcon from '@/assets/apple.svg';
import styles from './LoginForm.module.scss';

interface LoginFormProps {
  onRegisterClick?: () => void;
  redirectPath?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onRegisterClick, redirectPath }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const errorText = useMemo(() => authError, [authError]);

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    setAuthError('');

    const result = await login({ email, password });

    if (!result.ok) {
      setAuthError(result.message);
      setIsSubmitting(false);
      return;
    }

    navigate(redirectPath || '/profile', { replace: true });
    setIsSubmitting(false);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.socialButtons}>
        <Button type="button" variant="secondary" className={styles.socialButton}>
          <img src={googleIcon} width={24} height={24} alt="Google" />
          Продолжить с Google
        </Button>

        <Button type="button" variant="secondary" className={styles.socialButton}>
          <img src={appleIcon} width={24} height={24} alt="Apple" />
          Продолжить с Apple
        </Button>
      </div>

      <div className={styles.divider}>
        <span>или</span>
      </div>

      <div className={styles.fields}>
        <FormField label="Email">
          <Input
            type="email"
            name="email"
            placeholder="Введите email"
            value={email}
            disabled={isSubmitting}
            error={authError ? errorText : ''}
            onChange={(event) => {
              setEmail(event.target.value);
              if (authError) setAuthError('');
            }}
          />
        </FormField>

        <FormField label="Пароль">
          <Input
            type={isPasswordVisible ? 'text' : 'password'}
            name="password"
            placeholder="Введите ваш пароль"
            value={password}
            disabled={isSubmitting}
            error={authError ? errorText : ''}
            onChange={(event) => {
              setPassword(event.target.value);
              if (authError) setAuthError('');
            }}
            rightSlot={
              <button
                type="button"
                className={styles.iconButton}
                aria-label={isPasswordVisible ? 'Скрыть пароль' : 'Показать пароль'}
                onClick={() => setIsPasswordVisible((prev) => !prev)}
              >
                {isPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            }
          />
        </FormField>
      </div>

      {authError && <p className={styles.authError}>{errorText}</p>}

      <div className={styles.actions}>
        <Button
          type="submit"
          variant="primary"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Вход...' : 'Войти'}
        </Button>

        <button
          type="button"
          className={styles.registerLink}
          onClick={onRegisterClick}
          disabled={isSubmitting}
        >
          Зарегистрироваться
        </button>
      </div>
    </form>
  );
};
