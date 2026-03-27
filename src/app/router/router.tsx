import { createBrowserRouter } from 'react-router-dom';
import { PublicLayout } from '@/app/layouts/public-layout';
import { PrivateLayout } from '@/app/layouts/private-layout';
import LoginPage from '@/pages/LoginPage/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import { CatalogPage } from '@/pages/CatalogPage';
import { SkillPage } from '@/pages/skillPage';
import ProfilePage from '@/pages/ProfilePage';
import { ErrorPage404 } from '@/pages/ErrorPage404';
import { ErrorPage500 } from '@/pages/ErrorPage500';
import ProfileUserForm from '@/widgets/ProfileUserForm';
import ProfileFavorites from '@/widgets/ProfileFavorites';
import ProfileExchanges from '@/widgets/ProfileExchanges';
import ProfileRequests from '@/widgets/ProfileRequests';
import ProfileSkills from '@/widgets/ProfileSkills';
import RegPageStep3 from '@/pages/RegisterPage/RegPageStep3';
import RegPageStep2 from '@/pages/RegisterPage/RegisterPageStep2';

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <CatalogPage />,
      },
      {
        path: 'about',
        element: <h2>О нас - тут пока пусто, не MVP</h2>,
      },
      {
        path: 'skill/:skillId',
        element: <SkillPage />,
      },
      {
        path: '*',
        element: <ErrorPage404 />,
      },
    ],
  },
  {
    path: 'login',
    element: <LoginPage />,
  },
  {
    path: 'register',
    element: <RegisterPage />,
  },
  {
    path: 'register/step-2',
    element: <RegPageStep2 />,
  },
  {
    path: 'register/step-3',
    element: <RegPageStep3 />,
  },
  {
    element: <PrivateLayout />,
    children: [
      {
        path: 'profile',
        element: <ProfilePage />,
        children: [
          { index: true, element: <ProfileUserForm /> },
          { path: 'favorites', element: <ProfileFavorites /> },
          { path: 'requests', element: <ProfileRequests /> },
          { path: 'exchanges', element: <ProfileExchanges /> },
          { path: 'skills', element: <ProfileSkills /> },
        ],
      },
    ],
  },
  {
    path: 'server-error',
    element: <ErrorPage500 />,
  },
]);
