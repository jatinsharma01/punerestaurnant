import { Drink, DrinkSizeOption, CustomizationOption } from "./drink";

export interface SelectedCustomization {
  groupId: string;
  groupName: string;
  option: CustomizationOption;
}

export interface CartItem {
  id: string; // Unique composite key (e.g. `${drinkId}-${sizeId}-${sortedOptionsHash}`)
  drink: Drink;
  size: DrinkSizeOption;
  sugarLevel?: string;
  iceLevel?: string;
  customizations: SelectedCustomization[];
  quantity: number;
  unitPrice: number; // basePrice + size modifier + customization prices
  totalPrice: number; // unitPrice * quantity
  notes?: string;
}

export interface CartSummary {
  items: CartItem[];
  totalQuantity: number;
  subtotal: number;
  taxAmount: number; // GST (e.g., 5%)
  totalAmount: number;
  estimatedPrepMinutes: number;
}
