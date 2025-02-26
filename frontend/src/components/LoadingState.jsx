import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

const LoadingState = () => {
  const [dots, setDots] = useState('');
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
        <div className="text-xl font-medium text-gray-800 flex items-center">
          Carregando<span className="w-8 text-left">{dots}</span>
        </div>
        <div className="mt-2 text-gray-500">
          Preparando os dados das turmas...
        </div>
      </div>
    </div>
  );
};

export default LoadingState;