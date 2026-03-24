import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '@/app/layouts/MainLayout';
import LoginPage from '@/pages/LoginPage/LoginPage';
import { ErrorPage404 } from '@/pages/error404';
import ProfilePage from '@/pages/ProfilePage';
import ProfileUserForm from '@/widgets/ProfileUserForm';
import ProfileFavorites from '@/widgets/ProfileFavorites';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
        children: [
          {
            index: true,
            element: <ProfileUserForm />,
          },
          {
            path: 'favorites',
            element: <ProfileFavorites />,
          },
          {
            path: 'empty',
            element: <h2>Страница заглушка</h2>,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <ErrorPage404 />,
  },
]);
