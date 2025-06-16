import React, { useState } from "react";

import { Search } from "lucide-react";


const SearchAddBar = ({ onAdd, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (

    <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-2xl shadow-md mb-4 gap-4 w-full">
      <div className="relative w-full sm:max-w-md">

        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="text-gray-400 w-5 h-5" />
        </span>
        <input
          type="text"
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={handleSearchChange}

          className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-orange-300 transition"

        />
      </div>
      <button
        onClick={onAdd}

        className="bg-[#162556] text-white px-4 py-2 rounded-xl hover:bg-[#1d2d66] transition duration-300 w-full sm:w-auto"

      >
        Ajouter un nouveau client
      </button>
    </div>
  );
};

export default SearchAddBar;
