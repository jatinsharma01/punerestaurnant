"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { CartItem, CartSummary } from "@/types/cart";
import { calculateCartSummary } from "@/lib/pricing";

interface CartContextType {
  items: CartItem[];
  summary: CartSummary;
  isLoaded: boolean;
  isCartDrawerOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  addItem: (item: Omit<CartItem, "totalPrice">) => void;
  updateQuantity: (itemId: string, newQuantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "pour_club_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Safe client hydration from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch (e) {
      console.warn("Failed to retrieve cart from localStorage:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sync back to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("Failed to save cart to localStorage:", e);
    }
  }, [items, isLoaded]);

  const summary = useMemo(() => calculateCartSummary(items), [items]);

  const openCartDrawer = () => setIsCartDrawerOpen(true);
  const closeCartDrawer = () => setIsCartDrawerOpen(false);

  const addItem = (itemWithoutTotalPrice: Omit<CartItem, "totalPrice">) => {
    const totalPrice = itemWithoutTotalPrice.unitPrice * itemWithoutTotalPrice.quantity;
    const fullItem: CartItem = {
      ...itemWithoutTotalPrice,
      totalPrice,
    };

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((it) => it.id === fullItem.id);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        const existing = updated[existingIndex];
        const newQty = existing.quantity + fullItem.quantity;
        updated[existingIndex] = {
          ...existing,
          quantity: newQty,
          totalPrice: existing.unitPrice * newQty,
        };
        return updated;
      }
      return [...prevItems, fullItem];
    });

    setIsCartDrawerOpen(true);
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === itemId) {
          const clamped = Math.min(20, newQuantity);
          return {
            ...item,
            quantity: clamped,
            totalPrice: item.unitPrice * clamped,
          };
        }
        return item;
      })
    );
  };

  const removeItem = (itemId: string) => {
    setItems((prev) => prev.filter((it) => it.id !== itemId));
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        summary,
        isLoaded,
        isCartDrawerOpen,
        openCartDrawer,
        closeCartDrawer,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
