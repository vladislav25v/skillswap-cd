import { useLocation } from 'react-router-dom';
import type { AuthRedirectLocationState } from '@/features/auth/navigation';
import RegPageStep1 from './RegisterPageStep1';

const RegisterPage = () => {
  const location = useLocation();
  const redirectPath = (location.state as AuthRedirectLocationState | null)?.from;

  return <RegPageStep1 redirectPath={redirectPath} />;
};

export default RegisterPage;
