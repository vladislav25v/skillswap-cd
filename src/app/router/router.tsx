import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '@/app/layouts/MainLayout';
import LoginPage from '@/pages/LoginPage/LoginPage';
import { ErrorPage404 } from '@/pages/error404';

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
    ],
  },
  {
    path: '*',
    element: <ErrorPage404 />,
  },
]);
