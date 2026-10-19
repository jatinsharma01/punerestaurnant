"use client";

import React from "react";
import { DrinkCategory } from "@/types/drink";
import { CATEGORIES } from "@/data/drinks";

interface CategoryFilterProps {
  selectedCategory: DrinkCategory | "All";
  onSelectCategory: (category: DrinkCategory | "All") => void;
}

export default function CategoryFilter({
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  const allCategories: ("All" | DrinkCategory)[] = ["All", ...CATEGORIES];

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2">
      <div className="flex items-center gap-2 min-w-max pb-1">
        {allCategories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                isSelected
                  ? "bg-[#8DA419] text-[#121110] font-bold shadow-md shadow-[#8DA419]/30"
                  : "bg-[#1C1A18] text-[#C4BEB4] hover:bg-[#25221F] hover:text-white"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
