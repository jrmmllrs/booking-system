// src/components/dashboard/SearchFilter.jsx
import React from "react";
import { Search } from "lucide-react";

const SearchFilter = ({ searchTerm, setSearchTerm, placeholder = "Search..." }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200/50">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl">
          <Search className="w-5 h-5 text-gray-600" />
        </div>
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm"
        />
      </div>
    </div>
  );
};

export default SearchFilter;