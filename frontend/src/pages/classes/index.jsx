import { useState, useEffect } from "react";
import { Edit2, Trash2, Calendar, X } from "lucide-react";

import Nav from "../../components/NavPage";
import SearchBar from "../../components/SearchBar";
import ButtonAdd from "../../components/ButtonAdd";
import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";
import ClassFilters from "./ClassFilters";

import { ClassService } from "../../services/classes/classes";
import { NotificationService } from "../../services/notification/notification";
import { HandleApiError } from "../../utils/HandleError";

const ClassTable = ({ classes, onEdit, onDelete }) => (
  <div className="bg-white shadow rounded-lg overflow-hidden">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nome
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ano
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Data de Início
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Data de Término
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
          {classes.length > 0 ? (
            classes.map((classItem) => (
              <tr key={classItem.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-gray-500" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {classItem.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{classItem.year}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(classItem.start_date).toLocaleDateString('pt-BR')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(classItem.end_date).toLocaleDateString('pt-BR')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge isActive={classItem.is_active} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <ActionButtons
                    classItem={classItem}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                Nenhuma turma encontrada com os filtros selecionados
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

const StatusBadge = ({ isActive }) => (
  <span
    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
      isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
    }`}
  >
    {isActive ? "Ativa" : "Inativa"}
  </span>
);

const ActionButtons = ({ classItem, onEdit, onDelete }) => (
  <>
    <button
      onClick={() => onEdit(classItem)}
      className="text-blue-600 hover:text-blue-900 mr-4"
    >
      <Edit2 className="h-5 w-5" />
    </button>
    <button
      onClick={() => onDelete(classItem.id)}
      className="text-red-600 hover:text-red-900"
    >
      <Trash2 className="h-5 w-5" />
    </button>
  </>
);

const ClassModal = ({ mode, classItem, onClose, onSubmit }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg w-full max-w-md">
      <div className="flex justify-between items-center p-6 border-b">
        <h2 className="text-xl font-semibold text-gray-900">
          {mode === "create" ? "Nova Turma" : "Editar Turma"}
        </h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
          <X className="h-6 w-6" />
        </button>
      </div>

      <ClassForm
        classItem={classItem}
        mode={mode}
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    </div>
  </div>
);

const ClassForm = ({ classItem, mode, onSubmit, onCancel }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const classData = {
      name: formData.get("name"),
      description: formData.get("description"),
      year: parseInt(formData.get("year")),
      start_date: formData.get("start_date"),
      end_date: formData.get("end_date"),
      is_active: formData.get("status") === "Ativa",
    };

    onSubmit(classData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <FormField
        label="Nome"
        name="name"
        type="text"
        defaultValue={classItem?.name}
      />

      <FormField
        label="Descrição"
        name="description"
        type="textarea"
        defaultValue={classItem?.description}
      />

      <FormField
        label="Ano"
        name="year"
        type="number"
        defaultValue={classItem?.year || new Date().getFullYear()}
      />

      <FormField
        label="Data de Início"
        name="start_date"
        type="date"
        defaultValue={classItem?.start_date}
      />

      <FormField
        label="Data de Término"
        name="end_date"
        type="date"
        defaultValue={classItem?.end_date}
      />

      <FormField
        label="Status"
        name="status"
        type="select"
        defaultValue={classItem?.is_active ? "Ativa" : "Inativa"}
        options={[
          { value: "Ativa", label: "Ativa" },
          { value: "Inativa", label: "Inativa" },
        ]}
      />

      <FormButtons mode={mode} onCancel={onCancel} />
    </form>
  );
};

const FormField = ({
  label,
  name,
  type,
  defaultValue,
  options,
  required = true,
}) => {
  const baseInputClasses =
    "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required ? "" : "(opcional)"}
      </label>
      {type === "select" ? (
        <select
          name={name}
          defaultValue={defaultValue}
          className={baseInputClasses}
          required={required}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea
          name={name}
          defaultValue={defaultValue}
          className={`${baseInputClasses} h-24`}
          required={required}
        />
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
      {mode === "create" ? "Criar" : "Salvar"}
    </button>
  </div>
);

export default function Classes() {
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentClass, setCurrentClass] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estado para os filtros
  const [filters, setFilters] = useState({
    year: "",
    status: ""
  });

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const data = await ClassService.getClasses();
      setClasses(data);
      setError(null);
    } catch (err) {
      setError("Erro ao carregar turmas");
      HandleApiError(err);
      console.error("Error fetching classes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleEdit = (classItem) => {
    setCurrentClass(classItem);
    setModalMode("edit");
    setShowModal(true);
  };

  const handleDelete = async (classId) => {
    const result = await NotificationService.confirm(
      "Tem certeza que deseja excluir esta turma?"
    );

    if (result.isConfirmed) {
      try {
        await ClassService.deleteClass(classId);
        await fetchClasses();
        NotificationService.success("Turma excluída com sucesso!");
      } catch (error) {
        console.error("Error deleting class:", error);
        HandleApiError(error);
      }
    }
  };

  const handleSubmit = async (classData) => {
    try {
      if (modalMode === "create") {
        await ClassService.createClass(classData);
        NotificationService.success("Turma criada com sucesso!");
      } else {
        await ClassService.updateClass(currentClass.id, classData);
        NotificationService.success("Turma atualizada com sucesso!");
      }
      await fetchClasses();
      setShowModal(false);
    } catch (error) {
      console.error("Error saving class:", error);
      HandleApiError(error);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  // Aplicar filtros e busca
  const filteredClasses = classes.filter((classItem) => {
    // Filtro de texto (nome ou descrição)
    const matchesSearch = 
      classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtro por ano
    const matchesYear = 
      !filters.year || classItem.year === parseInt(filters.year);
    
    // Filtro por status
    const matchesStatus = 
      filters.status === "" || 
      (filters.status === "true" && classItem.is_active) ||
      (filters.status === "false" && !classItem.is_active);
    
    return matchesSearch && matchesYear && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav title="Gerenciamento de Turmas" />

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <SearchBar
              text="Buscar turmas..."
              value={searchTerm}
              onChange={setSearchTerm}
            />
            <ClassFilters 
              onFilterChange={handleFilterChange} 
              currentYear={new Date().getFullYear()}
            />
          </div>
          <ButtonAdd
            text="Nova Turma"
            onFunction={() => {
              setCurrentClass(null);
              setModalMode("create");
              setShowModal(true);
            }}
          />
        </div>
        
        {filters.year || filters.status ? (
          <div className="mb-4 flex flex-wrap gap-2">
            {filters.year && (
              <div className="inline-flex items-center px-2 py-1 rounded-md bg-blue-100 text-blue-800 text-sm">
                <span>Ano: {filters.year}</span>
                <button 
                  className="ml-2 text-blue-600 hover:text-blue-800"
                  onClick={() => setFilters({...filters, year: ""})}
                >
                  ×
                </button>
              </div>
            )}
            {filters.status && (
              <div className="inline-flex items-center px-2 py-1 rounded-md bg-blue-100 text-blue-800 text-sm">
                <span>Status: {filters.status === "true" ? "Ativas" : "Inativas"}</span>
                <button 
                  className="ml-2 text-blue-600 hover:text-blue-800"
                  onClick={() => setFilters({...filters, status: ""})}
                >
                  ×
                </button>
              </div>
            )}
            {(filters.year || filters.status) && (
              <button
                className="text-blue-600 hover:text-blue-800 text-sm"
                onClick={() => setFilters({year: "", status: ""})}
              >
                Limpar todos os filtros
              </button>
            )}
          </div>
        ) : null}

        <ClassTable
          classes={filteredClasses}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>

      {showModal && (
        <ClassModal
          mode={modalMode}
          classItem={currentClass}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}