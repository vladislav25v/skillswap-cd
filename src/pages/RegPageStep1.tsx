import React, { useState } from 'react';
import FormField from '@/shared/ui/FormField';
import Input from '@/shared/ui/Input';
import Button from '@/shared/ui/Button/Button';
import styles from './RegPageStep1.module.css';

import GoogleIcon from '@/assets/RegPages/Google.svg';
import AppleIcon from '@/assets/RegPages/Apple.svg';
import LightbulbIcon from '@/assets/RegPages/light-bulb.svg';
import EyeIcon from '@/assets/icons/eye.svg';
import EyeOffIcon from '@/assets/icons/eye-off.svg';

const RegPageStep1: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    console.log('Регистрация:', { email, password });
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>💡</span>
          <span className={styles.logoText}>SkillSwap</span>
        </div>

        <div className={styles.progress}>
          <span className={styles.progressCurrent}>Шаг 1</span>
          <span className={styles.progressDivider}> из 3</span>
        </div>

        <button className={styles.closeButton}>
          <span>Закрыть</span>
          <span className={styles.closeIcon}>✕</span>
        </button>
      </header>

      <main className={styles.main}>
        <div className={styles.formSection}>
          <div className={styles.formContainer}>
            <Button variant="secondary" className={styles.socialButton}>
              <img src={GoogleIcon} alt="Google" className={styles.socialIcon} />
              Продолжить с Google
            </Button>

            <Button variant="secondary" className={styles.socialButton}>
              <img src={AppleIcon} alt="Apple" className={styles.socialIcon} />
              Продолжить с Apple
            </Button>

            <div className={styles.divider}>
              <span>или</span>
            </div>

            <FormField label="Email" htmlFor="email">
              <Input
                id="email"
                type="email"
                placeholder="Введите email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              />
            </FormField>

            <FormField label="Пароль" htmlFor="password">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Придумайте надёжный пароль"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                rightSlot={
                  <button
                    type="button"
                    className={styles.showPassword}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <img
                      src={showPassword ? EyeOffIcon : EyeIcon}
                      alt={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                      className={styles.eyeIcon}
                    />
                  </button>
                }
              />
            </FormField>

            <p className={styles.passwordHint}>Пароль должен содержать не менее 8 знаков</p>

            <Button variant="primary" className={styles.submitButton} onClick={handleSubmit}>
              Далее
            </Button>
          </div>
        </div>

        <div className={styles.illustrationSection}>
          <img src={LightbulbIcon} alt="SkillSwap" className={styles.lightbulb} />
          <h2 className={styles.illustrationTitle}>Добро пожаловать в SkillSwap!</h2>
          <p className={styles.illustrationText}>
            Присоединяйтесь к SkillSwap и обменивайтесь знаниями и навыками с другими людьми
          </p>
        </div>
      </main>
    </div>
  );
};

export default RegPageStep1;
