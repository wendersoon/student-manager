import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RoleRoute } from '../components/RoleRoute';
import Login from '../pages/login';
import Home from '../pages/home';
import Dashboard from '../pages/dashboard';
import UserManagement from '../pages/users';

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
        path: '/usuarios',
        element: <UserManagement />,
      },
    ],
  },
  // Rotas exclusivas para admin
  {
    element: <RoleRoute allowedRoles={['admin']} />,
    children: [
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
    ],
  },
  // Rotas para admin e coordenador
  /*{
    element: <RoleRoute allowedRoles={['admin', 'coordenador']} />,
    children: [
      {
        path: '/turmas',
        element: <Classes />,
      },
      {
        path: '/usuarios',
        element: <Students />,
      },
    ],
  },*/
]);

function Router() {
  return <RouterProvider router={router} />;
}

export default Router;