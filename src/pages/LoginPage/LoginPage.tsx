import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/app/layouts/auth-layout/AuthLayout';
import { LoginForm, WelcomeCard } from '@/widgets/AuthForm';
import bulbIcon from '@/assets/light-bulb.svg';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <AuthLayout
      title="Вход"
      leftSlot={<LoginForm onRegisterClick={handleRegisterClick} />}
      rightSlot={
        <WelcomeCard
          title="С возвращением в SkillSwap!"
          text="Обменивайтесь знаниями и навыками с другими людьми"
          image={bulbIcon}
          imageAlt="Лампочка SkillSwap"
        />
      }
    />
  );
};

export default LoginPage;
