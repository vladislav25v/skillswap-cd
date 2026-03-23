import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { Eye, EyeOff } from 'lucide-react';
import Button from '@/shared/ui/Button/Button';
import Input from '@/shared/ui/Input';
import FormField from '@/shared/ui/FormField';
import { Logo } from '@/shared/ui/Logo';
import Title from '@/shared/ui/Title';
import { useAuth } from '@/app/providers/auth-context';
import googleIcon from '@/assets/google.svg';
import appleIcon from '@/assets/apple.svg';
import bulbIcon from '@/assets/light-bulb.svg';
import styles from './LoginPage.module.css';

const LoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const errorText = useMemo(() => authError, [authError]);

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setAuthError('');

    const result = await login({
      email,
      password,
    });

    if (!result.ok) {
      setAuthError(result.message);
      setIsSubmitting(false);
      return;
    }

    console.log('Login succeeded', {
      email: email.trim().toLowerCase(),
    });

    setIsSubmitting(false);
  };

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <Logo />
      </div>

      <section className={styles.content}>
        <Title tag="h2" looksLike="h3" className={styles.pageTitle}>
          Вход
        </Title>

        <div className={styles.columns}>
          <article className={styles.card}>
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <div className={styles.socialButtons}>
                <Button type="button" variant="secondary" className={clsx(styles.socialButton)}>
                  <img src={googleIcon} width={24} height={24} alt="Google" />
                  Продолжить с Google
                </Button>

                <Button type="button" variant="secondary" className={clsx(styles.socialButton)}>
                  <img src={appleIcon} width={24} height={24} alt="Apple" />
                  Продолжить с Apple
                </Button>
              </div>

              <div className={styles.divider}>
                <span>или</span>
              </div>

              <div className={styles.formMain}>
                <div className={styles.credentialsBlock}>
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
                          if (authError) {
                            setAuthError('');
                          }
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
                          if (authError) {
                            setAuthError('');
                          }
                        }}
                        rightSlot={
                          <button
                            type="button"
                            className={clsx(styles.iconButton)}
                            aria-label={isPasswordVisible ? 'Скрыть пароль' : 'Показать пароль'}
                            onClick={() => setIsPasswordVisible((prev) => !prev)}
                          >
                            {isPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        }
                      />
                    </FormField>
                  </div>

                  {authError && <p className={clsx(styles.authError)}>{errorText}</p>}
                </div>

                <div className={styles.actions}>
                  <Button
                    type="submit"
                    variant="primary"
                    className={clsx(styles.submitButton)}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Вход...' : 'Войти'}
                  </Button>

                  <button
                    type="button"
                    className={clsx(styles.registerLink)}
                    disabled={isSubmitting}
                  >
                    Зарегистрироваться
                  </button>
                </div>
              </div>
            </form>
          </article>

          <article className={styles.card}>
            <div className={styles.welcome}>
              <img
                src={bulbIcon}
                width={300}
                height={300}
                alt="Лампочка SkillSwap"
                className={styles.bulb}
              />
              <div className={styles.welcomeTextBlock}>
                <Title tag="h3" looksLike="h3" className={styles.welcomeTitle}>
                  С возвращением в SkillSwap!
                </Title>
                <p className={styles.welcomeText}>
                  Обменивайтесь знаниями и навыками с другими людьми
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
