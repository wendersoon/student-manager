import { useState } from "react";
import { Filter } from "lucide-react";

export default function ClassFilters({ onFilterChange, currentYear }) {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const years = [];
  for (let i = 0; i <= 5; i++) {
    years.push(currentYear - i);
  }

  const handleYearChange = (e) => {
    const year = e.target.value;
    setSelectedYear(year);
    onFilterChange({ year, status: selectedStatus });
  };

  const handleStatusChange = (e) => {
    const status = e.target.value;
    setSelectedStatus(status);
    onFilterChange({ year: selectedYear, status });
  };

  const clearFilters = () => {
    setSelectedYear("");
    setSelectedStatus("");
    onFilterChange({ year: "", status: "" });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center px-3 py-2 bg-white text-gray-700 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
      >
        <Filter className="h-5 w-5 mr-2" />
        Filtros {(selectedYear || selectedStatus) && <span className="ml-1 text-blue-600">•</span>}
      </button>
      
      {showFilters && (
        <div className="absolute mt-2 right-0 w-64 bg-white rounded-md shadow-lg z-10 p-4 border border-gray-200">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ano
              </label>
              <select
                value={selectedYear}
                onChange={handleYearChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={handleStatusChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos</option>
                <option value="true">Ativas</option>
                <option value="false">Inativas</option>
              </select>
            </div>
            
            <div className="flex justify-end pt-2">
              <button
                onClick={clearFilters}
                className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
              >
                Limpar filtros
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}