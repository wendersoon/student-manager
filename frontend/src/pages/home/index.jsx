import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../../services/auth/auth';
import { 
  Users, 
  GraduationCap, 
  School, 
  LayoutDashboard, 
  LogOut 
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const userRole = AuthService.getUserRole();

  const getNavigationCards = () => {
    const baseCards = {
      dashboard: {
        title: 'Dashboard',
        description: 'Visualize estatísticas e informações gerais',
        icon: LayoutDashboard,
        color: 'blue',
        path: '/dashboard'
      },
      users: {
        title: 'Gerenciar Usuários',
        description: 'Cadastre e gerencie usuários do sistema',
        icon: Users,
        color: 'green',
        path: '/usuarios'
      },
      students: {
        title: 'Gerenciar Estudantes',
        description: 'Administre o cadastro de estudantes',
        icon: GraduationCap,
        color: 'orange',
        path: '/estudantes'
      },
      classes: {
        title: 'Gerenciar Turmas',
        description: 'Organize e administre as turmas',
        icon: School,
        color: 'purple',
        path: '/turmas'
      },
    };

    switch (userRole) {
      case 'admin':
        return [
          baseCards.dashboard,
          baseCards.users,
          baseCards.students,
          baseCards.classes
        ];
      case 'coordenador':
        return [
          baseCards.users,
          baseCards.students,
          baseCards.classes
        ];
      case 'colaborador':
        return [
          baseCards.students
        ];
      default:
        return [];
    }
  };

  const navigationCards = getNavigationCards();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900">Gerenciador de Estudantes</h1>
            </div>

            {/* Right side icons */}
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700"
              onClick={() => AuthService.logout()}>
                <LogOut className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Bem-vindo(a)
          </h2>
          <p className="mt-1 text-gray-600">
            Selecione uma das opções abaixo para começar
          </p>
        </div>

        {/* Navigation Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {navigationCards.map((card) => {
            const IconComponent = card.icon;
            return (
              <button
                key={card.title}
                onClick={() => navigate(card.path)}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 text-left"
              >
                <div className={`inline-flex items-center justify-center p-3 rounded-lg bg-${card.color}-100`}>
                  <IconComponent className={`h-6 w-6 text-${card.color}-600`} />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  {card.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {card.description}
                </p>
              </button>
            )
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Visão Geral</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-gray-500">Total de Usuários</p>
              <p className="text-2xl font-bold text-gray-900">145</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-gray-500">Turmas Ativas</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-gray-500">Total de Estudantes</p>
              <p className="text-2xl font-bold text-gray-900">280</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-gray-500">Média de Alunos por Turma</p>
              <p className="text-2xl font-bold text-gray-900">23</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;