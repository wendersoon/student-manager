// UserTable.jsx
import { useState, useEffect } from 'react';
import { Plus, User, Edit2, Trash2, Search, X } from 'lucide-react';

import { UserService } from '../../services/users/users';
import { NotificationService } from '../../services/notification/notification';
import { HandleApiError } from '../../utils/HandleError';

import Nav from '../../components/NavPage';
import SearchBar from '../../components/SearchBar';

const UserTable = ({ users, onEdit, onDelete }) => (
  <div className="bg-white shadow rounded-lg overflow-hidden">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Usuário
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Função
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-500" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{user.name} {user.lastName}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{user.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{user.role}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge isActive={user.is_active}   />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <ActionButtons user={user} onEdit={onEdit} onDelete={onDelete} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const StatusBadge = ({ isActive }) => (
  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
    isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800'
  }`}>
    {isActive ? 'Ativo' : 'Inativo'}
  </span>
);

const ActionButtons = ({ user, onEdit, onDelete }) => (
  <>
    <button
      onClick={() => onEdit(user)}
      className="text-blue-600 hover:text-blue-900 mr-4"
    >
      <Edit2 className="h-5 w-5" />
    </button>
    <button
      onClick={() => onDelete(user.id)}
      className="text-red-600 hover:text-red-900"
    >
      <Trash2 className="h-5 w-5" />
    </button>
  </>
);

const UserModal = ({ mode, user, onClose, onSubmit }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg w-full max-w-md">
      <div className="flex justify-between items-center p-6 border-b">
        <h2 className="text-xl font-semibold text-gray-900">
          {mode === 'create' ? 'Novo Usuário' : 'Editar Usuário'}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
      
      <UserForm user={user} mode={mode} onSubmit={onSubmit} onCancel={onClose} />
    </div>
  </div>
);

const UserForm = ({ user, mode, onSubmit, onCancel }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userData = {
      name: formData.get('name'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      role: formData.get('role'),
      is_active: formData.get('status') === 'Ativo'
    };
    
    // Apenas inclui a senha se estiver criando um novo usuário ou se o campo não estiver vazio
    const password = formData.get('password');
    if (mode === 'create' || (password && password.trim() !== '')) {
      userData.password = password;
    }
    
    onSubmit(userData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <FormField
        label="Nome"
        name="name"
        type="text"
        defaultValue={user?.name}
      />

      <FormField
        label="Sobrenome"
        name="lastName"
        type="text"
        defaultValue={user?.lastName}
      />

      <FormField
        label="Email"
        name="email"
        type="email"
        defaultValue={user?.email}
      />
      
      <FormField
        label="Senha"
        name="password"
        type="password"
        defaultValue=""
        required={mode === 'create'} // Senha obrigatória apenas na criação
      />
      
      <FormField
        label="Função"
        name="role"
        type="select"
        defaultValue={user?.role || 'colaborador'}
        options={[
          { value: 'admin', label: 'Administrador' },
          { value: 'coordenador', label: 'Coordenador' },
          { value: 'colaborador', label: 'Colaborador' }
        ]}
      />
      
      <FormField
        label="Status"
        name="status"
        type="select"
        defaultValue={user?.is_active ? 'Ativo' : 'Inativo'}
        options={[
          { value: 'Ativo', label: 'Ativo' },
          { value: 'Inativo', label: 'Inativo' }
        ]}
      />

      <FormButtons mode={mode} onCancel={onCancel} />
    </form>
  );
};

const FormField = ({ label, name, type, defaultValue, options, required = true }) => {
  const baseInputClasses = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";
  
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required ? '' : '(opcional)'}
      </label>
      {type === 'select' ? (
        <select 
          name={name}
          defaultValue={defaultValue}
          className={baseInputClasses}
          required={required}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          name={name}
          type={type}
          defaultValue={defaultValue}
          className={baseInputClasses}
          required={required}
        />
      )}
    </div>
  );
};

const FormButtons = ({ mode, onCancel }) => (
  <div className="flex justify-end space-x-3 mt-6">
    <button
      type="button"
      onClick={onCancel}
      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
    >
      Cancelar
    </button>
    <button
      type="submit"
      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
    >
      {mode === 'create' ? 'Criar' : 'Salvar'}
    </button>
  </div>
);

const UserManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await UserService.getUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar usuários');
      HandleApiError(err);
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setCurrentUser(user);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleDelete = async (userId) => {
    const result = await NotificationService.confirm('Tem certeza que deseja excluir este usuário?');
    
    if (result.isConfirmed) {
      try {
        await UserService.deleteUser(userId);
        await fetchUsers();
        NotificationService.success('Usuário excluído com sucesso!');
      } catch (error) {
        console.error('Error deleting user:', error);
        HandleApiError(error);
      }
    }
  };

  const handleSubmit = async (userData) => {
    try {
      if (modalMode === 'create') {
        await UserService.createUser(userData);
        NotificationService.success('Usuário criado com sucesso!');
      } else {
        await UserService.updateUser(currentUser.id, userData);
        NotificationService.success('Usuário atualizado com sucesso!');
      }
      await fetchUsers();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving user:', error);
      HandleApiError(error);
    }
  }

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav title="Gerenciamento de Usuários" />

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <SearchBar text={"Buscar usuários..."} value={searchTerm} onChange={setSearchTerm} />
          
          <button
            onClick={() => {
              setCurrentUser(null);
              setModalMode('create');
              setShowModal(true);
            }}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Novo Usuário
          </button>
        </div>

        <UserTable 
          users={filteredUsers}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>

      {showModal && (
        <UserModal
          mode={modalMode}
          user={currentUser}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

// LoadingState.jsx
const LoadingState = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-xl text-gray-600">Carregando...</div>
  </div>
);

// ErrorState.jsx
const ErrorState = ({ error }) => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-xl text-red-600">{error}</div>
  </div>
);

export default UserManagement;