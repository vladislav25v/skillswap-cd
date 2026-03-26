import { createBrowserRouter } from 'react-router-dom';
import { PublicLayout } from '@/app/layouts/public-layout';
import { PrivateLayout } from '@/app/layouts/private-layout';
import LoginPage from '@/pages/LoginPage/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import { CatalogPage } from '@/pages/CatalogPage';
import { SkillPage } from '@/pages/skillPage/SkillPage';
import ProfilePage from '@/pages/ProfilePage';
import { ErrorPage404 } from '@/pages/ErrorPage404';
import { ErrorPage500 } from '@/pages/ErrorPage500';
import ProfileUserForm from '@/widgets/ProfileUserForm';
import ProfileFavorites from '@/widgets/ProfileFavorites';

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
  } /*
  ,
  {
    path: 'register/step-2',
    element: <RegPageStep2 />,
  },
  {
    path: 'register/step-3',
    element: <RegPageStep3 />,
  }
  */,
  {
    element: <PrivateLayout />,
    children: [
      {
        path: 'profile',
        element: <ProfilePage />,
        children: [
          { index: true, element: <ProfileUserForm /> },
          { path: 'favorites', element: <ProfileFavorites /> },
        ],
      },
    ],
  },
  {
    path: 'server-error',
    element: <ErrorPage500 />,
  },
]);
