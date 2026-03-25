import { createBrowserRouter } from 'react-router-dom';
import { AuthLayout } from '@/app/layouts/auth-layout';
import { PublicLayout } from '@/app/layouts/public-layout';
import { PrivateLayout } from '@/app/layouts/private-layout';
import LoginPage from '@/pages/LoginPage/LoginPage';

import RegPageStep1 from '@/pages/RegisterPage/RegisterPageStep1';

import { SkillPage } from '@/pages/SkillPage/SkillPage';
import ProfilePage from '@/pages/ProfilePage';
import { ErrorPage404 } from '@/pages/ErrorPage404';
import { ErrorPage500 } from '@/pages/ErrorPage500';
import ProfileUserForm from '@/widgets/ProfileUserForm';
import ProfileFavorites from '@/widgets/ProfileFavorites';

// Заглушки для отсутствующих страниц, донастроить
const CatalogPage = () => <h2>Главная страница - CatalogPage, доделать и поставить импорт </h2>;
const AboutPage = () => <h2>О нас - тут пока пусто, не MVP </h2>;

export const router = createBrowserRouter([
  // Публичные маршруты (до авторизации)
  {
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <CatalogPage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: 'skill/:id',
        element: <SkillPage />,
      },
    ],
  },

  // Маршруты авторизации
  {
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegPageStep1 />,
      } /*
      {
        path: 'register',
        element: <RegPageStep2 />,
      },
      {
        path: 'register',
        element: <RegPageStep3 />,
      },*/,
    ],
  },

  // Приватные маршруты (после авторизации)
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

  // Ошибки
  {
    path: '*',
    element: <ErrorPage404 />,
  },
  {
    path: 'server-error',
    element: <ErrorPage500 />,
  },
]);
