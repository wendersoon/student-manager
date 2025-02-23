import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";

export default function Nav({ title }) {
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/home")}
              className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Home className="h-6 w-6" />
              <span className="ml-2">Voltar para Home</span>
            </button>
            <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          </div>
        </div>
      </div>
    </nav>
  );
}
