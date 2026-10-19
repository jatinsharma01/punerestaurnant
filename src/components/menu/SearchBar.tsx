"use client";

import React from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  query: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  query,
  onChange,
  placeholder = "Search cold brew, matcha, lattes, refreshers...",
}: SearchBarProps) {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7D776E]">
        <Search className="w-4 h-4" />
      </div>

      <input
        type="text"
        value={query}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 bg-[#1C1A18] rounded-full text-base sm:text-sm text-white placeholder-[#7D776E] focus:outline-none focus:ring-2 focus:ring-[#8DA419] transition-all shadow-inner"
      />

      {query && (
        <button
          onClick={() => onChange("")}
          aria-label="Clear search query"
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#7D776E] hover:text-white cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
