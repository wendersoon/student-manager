import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RoleRoute } from '../components/RoleRoute';
import Login from '../pages/login';
import Home from '../pages/home';
import Dashboard from '../pages/dashboard';
import UserManagement from '../pages/users';
import Classes from '../pages/classes';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  // Rotas acessíveis por todos os usuários autenticados
  {
    element: <RoleRoute allowedRoles={['admin', 'coordenador', 'colaborador']} />,
    children: [
      {
        path: '/home',
        element: <Home />,
      },
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
    ],
  },
  // Rotas exclusivas para admin e coordenador
  {
    element: <RoleRoute allowedRoles={['admin', 'coordenador']} />,
    children: [
      {
        path: '/turmas',
        element: <Classes />,
      },
      {
        path: '/usuarios',
        element: <UserManagement />,
      },
    ],
  },
]);

function Router() {
  return <RouterProvider router={router} />;
}

export default Router;