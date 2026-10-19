"use client";

import React from "react";
import Image from "next/image";
import { Plus, Minus, Trash2 } from "lucide-react";
import { CartItem } from "@/types/cart";
import { formatINR } from "@/lib/currency";

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  compact?: boolean;
}

export default function CartItemRow({
  item,
  onUpdateQuantity,
  onRemove,
  compact = false,
}: CartItemRowProps) {
  const { drink, size, sugarLevel, iceLevel, customizations, quantity, totalPrice } = item;

  return (
    <div
      className={`flex items-start gap-4 ${
        compact ? "py-3" : "py-4"
      }`}
    >
      {/* Drink Image */}
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-[#24201D] shrink-0">
        <Image
          src={drink.image}
          alt={drink.alt || drink.name}
          fill
          sizes="80px"
          className="object-cover"
        />
      </div>

      {/* Drink Details & Customizations */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-semibold text-white truncate">
            {drink.name}
          </h4>
          <span className="text-sm font-bold text-[#ABC438] shrink-0">
            {formatINR(totalPrice)}
          </span>
        </div>

        {/* Selected Size */}
        <p className="text-xs text-[#A8A29A] mt-0.5">
          Size: <span className="text-white font-medium">{size.name} ({size.volume})</span>
        </p>

        {/* Sugar & Ice Levels */}
        {(sugarLevel || iceLevel) && (
          <p className="text-[11px] text-[#A8A29A] mt-0.5">
            {sugarLevel && <span>Sugar: {sugarLevel}</span>}
            {sugarLevel && iceLevel && <span className="mx-1">•</span>}
            {iceLevel && <span>Ice: {iceLevel}</span>}
          </p>
        )}

        {/* Customization Add-ons */}
        {customizations.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {customizations.map((c, i) => (
              <span
                key={i}
                className="inline-block text-[10px] bg-[#25221F] text-[#C4BEB4] px-1.5 py-0.5 rounded"
              >
                +{c.option.name}
              </span>
            ))}
          </div>
        )}

        {/* Unit Price & Controls */}
        <div className="flex items-center justify-between mt-3 pt-1">
          <div className="flex items-center rounded-full bg-[#1C1A18] px-2 py-0.5 shadow-md">
            <button
              onClick={() => onUpdateQuantity(item.id, quantity - 1)}
              aria-label="Decrease quantity"
              className="p-1 text-[#A8A29A] hover:text-white active:scale-95 transition-transform cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-6 text-center text-xs font-semibold text-white">
              {quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.id, quantity + 1)}
              aria-label="Increase quantity"
              className="p-1 text-[#A8A29A] hover:text-white active:scale-95 transition-transform cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => onRemove(item.id)}
            aria-label={`Remove ${drink.name} from cart`}
            className="text-xs text-[#7D776E] hover:text-red-400 flex items-center gap-1 p-1 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 text-[#7D776E] hover:text-red-400" />
            <span className="hidden sm:inline text-[11px]">Remove</span>
          </button>
        </div>
      </div>
    </div>
  );
}
