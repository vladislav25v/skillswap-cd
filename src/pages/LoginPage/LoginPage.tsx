import { useLocation, useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/app/layouts/auth-layout';
import type { AuthRedirectLocationState } from '@/features/auth/navigation';
import { LoginForm } from '@/widgets/AuthForm';
import bulbIcon from '@/assets/light-bulb.svg';
import AuthInfoCard from '@/widgets/AuthInfoCard';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = (location.state as AuthRedirectLocationState | null)?.from;

  const handleRegisterClick = () => {
    navigate('/register', {
      state: redirectPath ? { from: redirectPath } : undefined,
    });
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
