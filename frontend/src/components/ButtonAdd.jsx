import { Plus } from "lucide-react";

export default function ButtonAdd({ text, onFunction }) {
  return (
    <button
      onClick={onFunction}
      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center"
    >
      <Plus className="h-5 w-5 mr-2" />
      {text}
    </button>
  );
}
