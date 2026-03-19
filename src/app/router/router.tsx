import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '@/app/layouts/MainLayout';
import LoginPage from '@/pages/LoginPage/LoginPage';
import { ErrorPage404 } from '@/pages/error404';
import ProfileLayout from '@/pages/ProfilePage';
import ProfilePageForm from '@/pages/ProfilePage/ProfilePageForm';

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
        element: <ProfileLayout />,
        children: [
          {
            index: true,
            element: <ProfilePageForm />,
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
