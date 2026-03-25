import { useLocation, useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/app/layouts/auth-layout';
import { LoginForm, WelcomeCard } from '@/widgets/AuthForm';
import bulbIcon from '@/assets/light-bulb.svg';

interface LoginLocationState {
  from?: string;
}

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = (location.state as LoginLocationState | null)?.from;

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <AuthLayout
      title="Вход"
      leftSlot={<LoginForm onRegisterClick={handleRegisterClick} redirectPath={redirectPath} />}
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
