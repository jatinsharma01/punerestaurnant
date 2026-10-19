"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, Clock, Sparkles } from "lucide-react";
import { Drink } from "@/types/drink";
import { formatINR } from "@/lib/currency";
import { useCart } from "@/context/CartContext";

interface DrinkCardProps {
  drink: Drink;
}

export default function DrinkCard({ drink }: DrinkCardProps) {
  const { addItem } = useCart();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Add with default size and no extra customizations
    const defaultSize = drink.sizes[0];
    const defaultSugar = drink.availableSugarLevels?.[0];
    const defaultIce = drink.availableIceLevels?.[0];

    addItem({
      id: `${drink.id}__${defaultSize.id}__${defaultSugar || "def"}__${defaultIce || "def"}__`,
      drink,
      size: defaultSize,
      sugarLevel: defaultSugar,
      iceLevel: defaultIce,
      customizations: [],
      quantity: 1,
      unitPrice: drink.basePrice + defaultSize.priceModifier,
    });
  };

  return (
    <motion.div
      layout
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="group flex flex-col bg-[#1A1816] rounded-xl overflow-hidden shadow-xl"
    >
      {/* Drink Image Container */}
      <Link
        href={`/menu/${drink.slug}`}
        className="relative aspect-4/3 w-full overflow-hidden bg-[#24201D] block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8DA419]"
      >
        <Image
          src={drink.image}
          alt={drink.alt || drink.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {drink.signature && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[#121110]/90 backdrop-blur-xs text-white shadow-md">
              <Sparkles className="w-2.5 h-2.5 text-[#ABC438]" />
              Signature
            </span>
          )}
          {drink.popular && !drink.signature && (
            <span className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[#2B231D]/90 backdrop-blur-xs text-white shadow-md">
              Popular
            </span>
          )}
          {drink.isNew && (
            <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[#8DA419] text-[#121110] shadow-md">
              New
            </span>
          )}
        </div>

        {/* Prep Time pill */}
        <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1">
          <Clock className="w-3 h-3 text-[#ABC438]" />
          <span>~{drink.prepTimeMinutes}m prep</span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-[#ABC438]">
              {drink.category}
            </span>
            <span className="text-base font-bold text-white">
              {formatINR(drink.basePrice)}
            </span>
          </div>

          <Link
            href={`/menu/${drink.slug}`}
            className="block group-hover:text-[#ABC438] transition-colors focus:outline-none"
          >
            <h3 className="font-serif text-lg text-white line-clamp-1">
              {drink.name}
            </h3>
          </Link>

          <p className="text-xs text-[#A8A29A] line-clamp-2 leading-relaxed">
            {drink.description}
          </p>

          {drink.tastingNotes && drink.tastingNotes.length > 0 && (
            <div className="pt-1 flex flex-wrap gap-1">
              {drink.tastingNotes.slice(0, 3).map((note, idx) => (
                <span
                  key={idx}
                  className="text-[10px] text-[#C4BEB4] bg-[#25221F] px-2 py-0.5 rounded"
                >
                  {note}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Card Actions */}
        <div className="pt-3 flex items-center justify-between gap-2">
          <Link
            href={`/menu/${drink.slug}`}
            className="text-xs font-semibold text-white/90 hover:text-[#ABC438] underline-offset-4 hover:underline"
          >
            Customize
          </Link>

          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={handleQuickAdd}
            aria-label={`Quick add ${drink.name} to cart`}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#8DA419] text-[#121110] hover:bg-[#A3BA20] transition-colors cursor-pointer shadow-md"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
