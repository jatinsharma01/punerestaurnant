"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import CategoryFilter from "@/components/menu/CategoryFilter";
import SearchBar from "@/components/menu/SearchBar";
import DrinkCard from "@/components/menu/DrinkCard";
import { DRINKS_DATA } from "@/data/drinks";
import { DrinkCategory } from "@/types/drink";
import { SlidersHorizontal, ArrowUpDown } from "lucide-react";

type SortOption = "recommended" | "price-asc" | "price-desc" | "prep-time";

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState<DrinkCategory | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("recommended");

  const filteredDrinks = useMemo(() => {
    return DRINKS_DATA.filter((drink) => {
      // Category filter
      if (selectedCategory !== "All" && drink.category !== selectedCategory) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = drink.name.toLowerCase().includes(q);
        const matchesDesc = drink.description.toLowerCase().includes(q);
        const matchesCategory = drink.category.toLowerCase().includes(q);
        const matchesNotes = drink.tastingNotes?.some((n) =>
          n.toLowerCase().includes(q)
        );
        if (!matchesName && !matchesDesc && !matchesCategory && !matchesNotes) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") {
        return a.basePrice - b.basePrice;
      }
      if (sortBy === "price-desc") {
        return b.basePrice - a.basePrice;
      }
      if (sortBy === "prep-time") {
        return a.prepTimeMinutes - b.prepTimeMinutes;
      }
      // Default: Recommended (Signature first, then popular, then normal)
      const rankA = a.signature ? 3 : a.popular ? 2 : 1;
      const rankB = b.signature ? 3 : b.popular ? 2 : 1;
      return rankB - rankA;
    });
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <div className="flex flex-col min-h-screen bg-[#121110] text-[#F5F3EF]">
      <SiteHeader />

      <main className="flex-1 py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Page Heading & Short Intro */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-3"
          >
            <span className="text-xs font-semibold tracking-widest uppercase text-[#ABC438]">
              Handcrafted Catalogue • Pune Outlet
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl tracking-tight text-white">
              Drinks Menu
            </h1>
            <p className="text-sm sm:text-base text-[#A8A29A] max-w-2xl leading-relaxed">
              Explore 12+ artisanal beverages pulled, brewed, and blended fresh at our Pune counter. Select your preferred drink to customize milk, ice, sweetness, and reserve your pickup slot.
            </p>
          </motion.div>

          {/* Controls Bar: Search, Category Filters, Sort */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4 pt-2"
          >
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="w-full md:max-w-md">
                <SearchBar query={searchQuery} onChange={setSearchQuery} />
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                <ArrowUpDown className="w-4 h-4 text-[#7D776E]" />
                <label htmlFor="sort-select" className="text-xs text-[#A8A29A] font-medium">
                  Sort:
                </label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-[#1C1A18] rounded-full text-xs font-medium text-white px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-[#8DA419] cursor-pointer"
                >
                  <option value="recommended">Recommended (Signature first)</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="prep-time">Fastest Prep Time</option>
                </select>
              </div>
            </div>

            {/* Category Filter Pills */}
            <CategoryFilter
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </motion.div>

          {/* Drinks Grid or Empty State */}
          {filteredDrinks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#1C1A18] rounded-2xl py-20 px-4 text-center space-y-4 shadow-xl"
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-[#25221F] flex items-center justify-center text-[#7D776E]">
                <SlidersHorizontal className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-lg text-white">
                  No drinks match your criteria
                </h3>
                <p className="text-xs text-[#A8A29A]">
                  Try clearing your search query or selecting another category.
                </p>
              </div>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="inline-flex text-xs font-semibold uppercase tracking-wider text-[#121110] bg-[#8DA419] hover:bg-[#A3BA20] px-5 py-2.5 rounded-full cursor-pointer"
              >
                Reset Filters
              </button>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-[#A8A29A] px-1">
                <span>
                  Showing {filteredDrinks.length}{" "}
                  {filteredDrinks.length === 1 ? "beverage" : "beverages"}
                </span>
                {selectedCategory !== "All" && (
                  <span className="font-medium text-[#ABC438]">
                    Category: {selectedCategory}
                  </span>
                )}
              </div>

              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                <AnimatePresence>
                  {filteredDrinks.map((drink) => (
                    <motion.div
                      key={drink.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                    >
                      <DrinkCard drink={drink} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
