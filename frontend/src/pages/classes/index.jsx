import { useState } from "react";

import Nav from "../../components/NavPage";
import SearchBar from "../../components/SearchBar";



export default function Classes() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav title={"Turmas"} />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <SearchBar text={"Buscar turmas..."} value={searchTerm} onChange={setSearchTerm} />

        </div>
      </main>
    </div>
  );
}
