import { Search } from 'lucide-react';

export default function SearchBar({ text, value, onChange }) {
    return (
        <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
            type="text"
            placeholder={text}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
        />
        </div>
    );
}