import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { Eye, EyeOff } from 'lucide-react';
import Button from '@/shared/ui/Button/Button';
import Input from '@/shared/ui/Input';
import FormField from '@/shared/ui/FormField';
import { Logo } from '@/shared/ui/Logo';
import Title from '@/shared/ui/Title';
import googleIcon from '@/assets/google.svg';
import appleIcon from '@/assets/apple.svg';
import bulbIcon from '@/assets/light-bulb.svg';
import styles from './LoginPage.module.css';

const DEMO_EMAIL = 'demo@skillswap.ru';
const DEMO_PASSWORD = 'skillswap';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isAuthError, setIsAuthError] = useState(false);

  const errorText = useMemo(
    () =>
      isAuthError
        ? 'Email или пароль введён неверно. Пожалуйста проверьте правильность введённых данных'
        : '',
    [isAuthError],
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isValid = email.trim() === DEMO_EMAIL && password === DEMO_PASSWORD;
    setIsAuthError(!isValid);
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
                        error={isAuthError ? errorText : ''}
                        onChange={(event) => {
                          setEmail(event.target.value);
                          if (isAuthError) {
                            setIsAuthError(false);
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
                        error={isAuthError ? errorText : ''}
                        onChange={(event) => {
                          setPassword(event.target.value);
                          if (isAuthError) {
                            setIsAuthError(false);
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

                  {isAuthError && <p className={clsx(styles.authError)}>{errorText}</p>}
                </div>

                <div className={styles.actions}>
                  <Button type="submit" variant="primary" className={clsx(styles.submitButton)}>
                    Войти
                  </Button>

                  <button type="button" className={clsx(styles.registerLink)}>
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
