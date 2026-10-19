"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Sparkles,
  Plus,
  Minus,
  Check,
  ShoppingBag,
  CheckCircle2,
} from "lucide-react";
import { Drink, DrinkSizeOption, CustomizationOption } from "@/types/drink";
import { SelectedCustomization } from "@/types/cart";
import { formatINR } from "@/lib/currency";
import { calculateItemUnitPrice, generateCartItemId } from "@/lib/pricing";
import { useCart } from "@/context/CartContext";

interface DrinkDetailCustomizerProps {
  drink: Drink;
}

export default function DrinkDetailCustomizer({
  drink,
}: DrinkDetailCustomizerProps) {
  const { addItem, openCartDrawer } = useCart();

  // State
  const [selectedSize, setSelectedSize] = useState<DrinkSizeOption>(
    drink.sizes[0]
  );
  const [selectedSugar, setSelectedSugar] = useState<string | undefined>(
    drink.availableSugarLevels ? drink.availableSugarLevels[0] : undefined
  );
  const [selectedIce, setSelectedIce] = useState<string | undefined>(
    drink.availableIceLevels ? drink.availableIceLevels[0] : undefined
  );
  const [selectedCustomizations, setSelectedCustomizations] = useState<
    SelectedCustomization[]
  >([]);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  // Toggle or select customization option
  const handleToggleCustomization = (
    groupId: string,
    groupName: string,
    groupType: "single" | "multiple",
    option: CustomizationOption
  ) => {
    if (groupType === "single") {
      const isAlready = selectedCustomizations.some(
        (c) => c.groupId === groupId && c.option.id === option.id
      );
      if (isAlready) {
        setSelectedCustomizations((prev) =>
          prev.filter((c) => c.groupId !== groupId)
        );
      } else {
        setSelectedCustomizations((prev) => [
          ...prev.filter((c) => c.groupId !== groupId),
          { groupId, groupName, option },
        ]);
      }
    } else {
      const exists = selectedCustomizations.some(
        (c) => c.groupId === groupId && c.option.id === option.id
      );
      if (exists) {
        setSelectedCustomizations((prev) =>
          prev.filter(
            (c) => !(c.groupId === groupId && c.option.id === option.id)
          )
        );
      } else {
        setSelectedCustomizations((prev) => [
          ...prev,
          { groupId, groupName, option },
        ]);
      }
    }
  };

  // Live Unit and Total Price calculation
  const unitPrice = useMemo(() => {
    return calculateItemUnitPrice(
      drink,
      selectedSize,
      selectedCustomizations
    );
  }, [drink, selectedSize, selectedCustomizations]);

  const totalPrice = unitPrice * quantity;

  // Add to cart action
  const handleAddToCart = () => {
    const itemId = generateCartItemId(
      drink.id,
      selectedSize.id,
      selectedSugar,
      selectedIce,
      selectedCustomizations
    );

    addItem({
      id: itemId,
      drink,
      size: selectedSize,
      sugarLevel: selectedSugar,
      iceLevel: selectedIce,
      customizations: selectedCustomizations,
      quantity,
      unitPrice,
    });

    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
    }, 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/menu"
          className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-[#A8A29A] hover:text-[#ABC438] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Drinks Menu</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left Column: Large Beverage Photo */}
        <div className="lg:col-span-6">
          <div className="sticky top-28 space-y-4">
            <div className="relative aspect-4/5 rounded-2xl overflow-hidden bg-[#1E1B18] shadow-xl">
              <Image
                src={drink.image}
                alt={drink.alt || drink.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                {drink.signature && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#121110]/90 backdrop-blur-xs text-white">
                    <Sparkles className="w-3 h-3 text-[#ABC438]" />
                    Signature
                  </span>
                )}
                {drink.popular && !drink.signature && (
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#2B231D]/90 backdrop-blur-xs text-white">
                    Popular
                  </span>
                )}
                {drink.isNew && (
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#8DA419] text-[#121110]">
                    New
                  </span>
                )}
              </div>
            </div>

            {/* Preparation lead banner */}
            <div className="p-4 rounded-xl bg-[#1C1A18] flex items-center justify-between text-xs text-[#C4BEB4] shadow-md">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#8DA419]" />
                <span>Estimated prep time at Pune counter:</span>
              </div>
              <span className="font-bold text-white">
                ~{drink.prepTimeMinutes} mins
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Customizations & Order Panel */}
        <div className="lg:col-span-6 space-y-8">
          {/* Header Info */}
          <div className="space-y-2 pb-6">
            <span className="text-xs font-semibold tracking-wider uppercase text-[#ABC438]">
              {drink.category} • {drink.caffeineLevel || "Medium"} Caffeine
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-white">
              {drink.name}
            </h1>
            <p className="text-sm text-[#A8A29A] leading-relaxed">
              {drink.description}
            </p>

            {/* Tasting Notes */}
            {drink.tastingNotes && (
              <div className="pt-2 flex flex-wrap gap-1.5 items-center">
                <span className="text-xs text-[#7D776E] font-medium mr-1">
                  Notes:
                </span>
                {drink.tastingNotes.map((note, idx) => (
                  <span
                    key={idx}
                    className="text-xs text-[#C4BEB4] bg-[#25221F] px-2.5 py-0.5 rounded-full"
                  >
                    {note}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Size Selector */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-white">
                1. Select Size
              </label>
              <span className="text-xs text-[#A8A29A]">
                {selectedSize.name} ({selectedSize.volume})
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {drink.sizes.map((size) => {
                const isSelected = selectedSize.id === size.id;
                return (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size)}
                    type="button"
                    className={`p-3.5 rounded-xl text-left transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#232B0D] ring-2 ring-[#8DA419]"
                        : "bg-[#1C1A18] hover:bg-[#221F1C]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-white">
                        {size.name}
                      </span>
                      {size.priceModifier > 0 && (
                        <span className="text-xs font-medium text-[#ABC438]">
                          +{formatINR(size.priceModifier)}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-[#A8A29A]">{size.volume}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sweetness Selector (if applicable) */}
          {drink.availableSugarLevels && drink.availableSugarLevels.length > 0 && (
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-white">
                2. Sweetness Level
              </label>
              <div className="flex flex-wrap gap-2">
                {drink.availableSugarLevels.map((lvl) => {
                  const isSelected = selectedSugar === lvl;
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSelectedSugar(lvl)}
                      className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#8DA419] text-[#121110] font-bold shadow-md"
                          : "bg-[#1C1A18] text-[#C4BEB4] hover:bg-[#221F1C] hover:text-white"
                      }`}
                    >
                      {lvl}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Ice Level (if applicable) */}
          {drink.availableIceLevels && drink.availableIceLevels.length > 0 && (
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-white">
                3. Ice Level
              </label>
              <div className="flex flex-wrap gap-2">
                {drink.availableIceLevels.map((lvl) => {
                  const isSelected = selectedIce === lvl;
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSelectedIce(lvl)}
                      className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#8DA419] text-[#121110] font-bold shadow-md"
                          : "bg-[#1C1A18] text-[#C4BEB4] hover:bg-[#221F1C] hover:text-white"
                      }`}
                    >
                      {lvl}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Customization Groups (Milk, Syrups, Additions) */}
          {drink.customizationGroups?.map((group) => (
            <div key={group.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-white">
                  {group.name}
                </label>
                <span className="text-[11px] text-[#A8A29A]">
                  {group.type === "single" ? "Choose one" : "Select any"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {group.options.map((option) => {
                  const isSelected = selectedCustomizations.some(
                    (c) => c.groupId === group.id && c.option.id === option.id
                  );
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() =>
                        handleToggleCustomization(
                          group.id,
                          group.name,
                          group.type,
                          option
                        )
                      }
                      className={`p-3 rounded-lg text-left flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#232B0D] ring-2 ring-[#8DA419]"
                          : "bg-[#1C1A18] hover:bg-[#221F1C]"
                      }`}
                    >
                      <span className="text-xs font-medium text-white">
                        {option.name}
                      </span>
                      <span className="text-xs text-[#ABC438] font-semibold">
                        {option.price > 0 ? `+${formatINR(option.price)}` : "Free"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Sticky/Bottom Add To Cart Bar */}
          <div className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-[#A8A29A]">Total for selection:</span>
                <div className="text-2xl font-bold text-white">
                  {formatINR(totalPrice)}
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center rounded-full bg-[#1C1A18] px-3 py-1.5 shadow-md">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="p-1 text-[#A8A29A] hover:text-white cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center text-sm font-bold text-white">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                  aria-label="Increase quantity"
                  className="p-1 text-[#A8A29A] hover:text-white cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider bg-[#8DA419] text-[#121110] hover:bg-[#A3BA20] transition-all shadow-lg active:scale-[0.98] cursor-pointer"
              >
                {justAdded ? (
                  <>
                    <Check className="w-4 h-4 text-[#121110]" />
                    <span>Added to Order Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add {quantity > 1 ? `(${quantity})` : ""} to Bag • {formatINR(totalPrice)}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  handleAddToCart();
                  openCartDrawer();
                }}
                className="px-6 py-4 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#1C1A18] text-white hover:bg-[#25221F] cursor-pointer"
              >
                View Bag
              </button>
            </div>

            {justAdded && (
              <div className="p-3 bg-[#232B0D] rounded-lg flex items-center gap-2 text-xs text-white animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-[#8DA419]" />
                <span>
                  <strong>{drink.name}</strong> added to bag. Next step: Choose pickup time in Pune.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
