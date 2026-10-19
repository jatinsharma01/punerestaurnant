import { BRAND_CONFIG } from "@/config/outlet";
import { Drink, DrinkSizeOption } from "@/types/drink";
import { CartItem, SelectedCustomization, CartSummary } from "@/types/cart";
import { DRINKS_DATA } from "@/data/drinks";

/**
 * Calculate the single unit price for a drink given size and customizations.
 */
export function calculateItemUnitPrice(
  drink: Drink,
  size: DrinkSizeOption,
  customizations: SelectedCustomization[]
): number {
  const base = drink.basePrice;
  const sizeCost = size.priceModifier || 0;
  const customCost = customizations.reduce(
    (acc, curr) => acc + (curr.option.price || 0),
    0
  );
  return base + sizeCost + customCost;
}

/**
 * Generate a unique deterministic cart item identifier based on drink, size, and selections.
 */
export function generateCartItemId(
  drinkId: string,
  sizeId: string,
  sugarLevel?: string,
  iceLevel?: string,
  customizations: SelectedCustomization[] = []
): string {
  const sortedCustomIds = customizations
    .map((c) => `${c.groupId}:${c.option.id}`)
    .sort()
    .join("|");
  return `${drinkId}__${sizeId}__${sugarLevel || "def"}__${iceLevel || "def"}__${sortedCustomIds}`;
}

/**
 * Compute the full cart summary (subtotal, GST tax, total, prep minutes).
 */
export function calculateCartSummary(items: CartItem[]): CartSummary {
  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.totalPrice, 0);
  
  // 5% GST (standard Indian restaurant/cafe rate for in-store pickup)
  const taxAmount = Math.round((subtotal * BRAND_CONFIG.defaultTaxRatePercent) / 100);
  const totalAmount = subtotal + taxAmount;

  // Estimate prep time: base on maximum individual prep time + 1 min for each additional drink beyond first
  const maxIndividualPrep = items.reduce(
    (max, item) => Math.max(max, item.drink.prepTimeMinutes || 3),
    0
  );
  const extraPrepForVolume = Math.min(10, Math.max(0, totalQuantity - 1));
  const estimatedPrepMinutes = totalQuantity > 0 ? maxIndividualPrep + extraPrepForVolume : 0;

  return {
    items,
    totalQuantity,
    subtotal,
    taxAmount,
    totalAmount,
    estimatedPrepMinutes,
  };
}

/**
 * Authoritative Server-Side Validation:
 * Validates cart items against hard-coded DRINKS_DATA.
 * Re-evaluates prices, sizes, and customizations to guarantee zero tampering.
 */
export function validateAndCalculateServerOrder(
  clientItems: Array<{
    drinkId: string;
    sizeId: string;
    sugarLevel?: string;
    iceLevel?: string;
    customizationIds?: { groupId: string; optionId: string }[];
    quantity: number;
  }>
): {
  valid: boolean;
  error?: string;
  subtotal: number;
  tax: number;
  total: number;
  amountInPaise: number;
  verifiedItems: CartItem[];
} {
  if (!clientItems || clientItems.length === 0) {
    return {
      valid: false,
      error: "Cart is empty.",
      subtotal: 0,
      tax: 0,
      total: 0,
      amountInPaise: 0,
      verifiedItems: [],
    };
  }

  const verifiedItems: CartItem[] = [];

  for (const clientItem of clientItems) {
    const authoritativeDrink = DRINKS_DATA.find((d) => d.id === clientItem.drinkId);
    if (!authoritativeDrink) {
      return {
        valid: false,
        error: `Drink with id "${clientItem.drinkId}" does not exist in Pour Club menu.`,
        subtotal: 0,
        tax: 0,
        total: 0,
        amountInPaise: 0,
        verifiedItems: [],
      };
    }

    if (!authoritativeDrink.inStock) {
      return {
        valid: false,
        error: `${authoritativeDrink.name} is currently out of stock.`,
        subtotal: 0,
        tax: 0,
        total: 0,
        amountInPaise: 0,
        verifiedItems: [],
      };
    }

    const authoritativeSize = authoritativeDrink.sizes.find(
      (s) => s.id === clientItem.sizeId
    );
    if (!authoritativeSize) {
      return {
        valid: false,
        error: `Invalid size selected for ${authoritativeDrink.name}.`,
        subtotal: 0,
        tax: 0,
        total: 0,
        amountInPaise: 0,
        verifiedItems: [],
      };
    }

    const verifiedCustomizations: SelectedCustomization[] = [];
    if (clientItem.customizationIds && clientItem.customizationIds.length > 0) {
      for (const customReq of clientItem.customizationIds) {
        const group = authoritativeDrink.customizationGroups?.find(
          (g) => g.id === customReq.groupId
        );
        const opt = group?.options.find((o) => o.id === customReq.optionId);
        if (group && opt) {
          verifiedCustomizations.push({
            groupId: group.id,
            groupName: group.name,
            option: opt,
          });
        }
      }
    }

    const quantity = Math.max(1, Math.min(20, Math.floor(clientItem.quantity || 1)));
    const unitPrice = calculateItemUnitPrice(
      authoritativeDrink,
      authoritativeSize,
      verifiedCustomizations
    );
    const totalPrice = unitPrice * quantity;

    verifiedItems.push({
      id: generateCartItemId(
        authoritativeDrink.id,
        authoritativeSize.id,
        clientItem.sugarLevel,
        clientItem.iceLevel,
        verifiedCustomizations
      ),
      drink: authoritativeDrink,
      size: authoritativeSize,
      sugarLevel: clientItem.sugarLevel,
      iceLevel: clientItem.iceLevel,
      customizations: verifiedCustomizations,
      quantity,
      unitPrice,
      totalPrice,
    });
  }

  const subtotal = verifiedItems.reduce((acc, it) => acc + it.totalPrice, 0);
  const tax = Math.round((subtotal * BRAND_CONFIG.defaultTaxRatePercent) / 100);
  const total = subtotal + tax;
  const amountInPaise = Math.round(total * 100);

  return {
    valid: true,
    subtotal,
    tax,
    total,
    amountInPaise,
    verifiedItems,
  };
}
