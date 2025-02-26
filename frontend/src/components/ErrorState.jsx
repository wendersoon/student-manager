import { AlertCircle, RefreshCw } from 'lucide-react';

const ErrorState = ({ error }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center max-w-md w-full">
        <div className="text-red-500 mb-4">
          <AlertCircle className="h-12 w-12 animate-pulse" />
        </div>
        <h2 className="text-xl font-medium text-gray-800 mb-2">
          Ops! Algo deu errado
        </h2>
        <div className="px-4 py-3 bg-red-50 border border-red-100 rounded-md text-red-600 w-full text-center mb-4">
          {error}
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Tentar novamente
        </button>
      </div>
    </div>
  );
};

export default ErrorState;