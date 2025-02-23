import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, 
  LineChart, Line,
  XAxis, YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Users,
  School,
  GraduationCap,
  TrendingUp,
  Bell,
  User,
  LogOut,
  Home
} from 'lucide-react';
import Nav from '../../components/NavPage';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Dados de exemplo para os gráficos
  const monthlyData = [
    { name: 'Jan', estudantes: 240, turmas: 10 },
    { name: 'Fev', estudantes: 250, turmas: 11 },
    { name: 'Mar', estudantes: 265, turmas: 12 },
    { name: 'Abr', estudantes: 275, turmas: 12 },
    { name: 'Mai', estudantes: 280, turmas: 12 },
    { name: 'Jun', estudantes: 290, turmas: 13 }
  ];

  const turmaData = [
    { name: '1º Ano', value: 80 },
    { name: '2º Ano', value: 75 },
    { name: '3º Ano', value: 70 },
    { name: '4º Ano', value: 65 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const stats = [
    { 
      title: 'Total de Alunos',
      value: '290',
      change: '+15',
      icon: GraduationCap,
      color: 'blue'
    },
    {
      title: 'Total de Turmas',
      value: '13',
      change: '+2',
      icon: School,
      color: 'green'
    },
    {
      title: 'Total de Professores',
      value: '28',
      change: '+3',
      icon: Users,
      color: 'purple'
    },
    {
      title: 'Média por Turma',
      value: '22',
      change: '+1',
      icon: TrendingUp,
      color: 'orange'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav title="Dashboard" />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <div key={stat.title} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 rounded-lg p-3 bg-${stat.color}-100`}>
                    <IconComponent className={`h-6 w-6 text-${stat.color}-600`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                    <div className="flex items-baseline">
                      <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                      <p className="ml-2 text-sm font-medium text-green-600">{stat.change}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Line Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Evolução de Alunos</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="estudantes" 
                    stroke="#0088FE" 
                    name="Estudantes"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Turmas por Mês</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="turmas" 
                    fill="#00C49F" 
                    name="Turmas"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Distribuição por Ano</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={turmaData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {turmaData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Atividades Recentes</h2>
            <div className="space-y-4">
              {[
                { text: 'Nova turma adicionada: 3º Ano B', time: '2 horas atrás' },
                { text: '5 novos alunos matriculados', time: '4 horas atrás' },
                { text: 'Relatório mensal gerado', time: '1 dia atrás' },
                { text: 'Novo professor registrado', time: '2 dias atrás' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.text}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;