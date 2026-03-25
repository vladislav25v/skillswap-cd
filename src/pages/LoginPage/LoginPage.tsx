import { useLocation, useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/app/layouts/auth-layout';
import { LoginForm } from '@/widgets/AuthForm';
import bulbIcon from '@/assets/light-bulb.svg';
import AuthInfoCard from '@/widgets/AuthInfoCard';

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
        <AuthInfoCard
          title="С возвращением в SkillSwap!"
          text="Обменивайтесь знаниями и навыками с другими людьми"
          picture={bulbIcon}
          pictureAlt="Лампочка SkillSwap"
        />
      }
    />
  );
};

export default LoginPage;
