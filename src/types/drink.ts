export type DrinkCategory =
  | "Coffee"
  | "Iced Coffee"
  | "Tea"
  | "Matcha"
  | "Fresh Juices"
  | "Milkshakes"
  | "Mocktails"
  | "Refreshers";

export type DrinkSizeOption = {
  id: string;
  name: string;
  volume: string;
  priceModifier: number; // in INR
};

export type CustomizationOption = {
  id: string;
  name: string;
  price: number; // in INR, e.g. +30 for oat milk
};

export type CustomizationGroup = {
  id: string;
  name: string;
  description?: string;
  required: boolean;
  type: "single" | "multiple";
  options: CustomizationOption[];
};

export interface Drink {
  id: string;
  slug: string;
  name: string;
  category: DrinkCategory;
  tagline: string;
  description: string;
  basePrice: number; // INR
  image: string;
  alt: string;
  prepTimeMinutes: number; // Estimated preparation time in minutes
  sizes: DrinkSizeOption[];
  availableSugarLevels?: string[]; // e.g., ["0%", "50%", "Standard (100%)", "Extra Sweet"]
  availableIceLevels?: string[]; // e.g., ["No Ice", "Light Ice", "Regular Ice", "Extra Chill"]
  customizationGroups?: CustomizationGroup[];
  popular?: boolean;
  isNew?: boolean;
  signature?: boolean;
  inStock: boolean;
  tastingNotes?: string[];
  caffeineLevel?: "None" | "Low" | "Medium" | "High";
}
