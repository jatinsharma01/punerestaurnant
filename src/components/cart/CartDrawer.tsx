"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, ArrowRight, Clock } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatINR } from "@/lib/currency";
import CartItemRow from "./CartItemRow";

export default function CartDrawer() {
  const {
    items,
    summary,
    isCartDrawerOpen,
    closeCartDrawer,
    updateQuantity,
    removeItem,
  } = useCart();

  return (
    <AnimatePresence>
      {isCartDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Dimmed Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeCartDrawer}
            className="fixed inset-0 bg-black/75 backdrop-blur-xs cursor-pointer"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10 pointer-events-none w-full sm:w-auto">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="w-full sm:max-w-md bg-[#141210] shadow-2xl flex flex-col justify-between text-white pointer-events-auto h-full"
            >
          {/* Drawer Header */}
          <div className="px-6 py-5 flex items-center justify-between bg-[#1A1816]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#ABC438]" />
              <h2 className="font-serif text-xl tracking-tight text-white">
                Your Order Bag
              </h2>
              <span className="text-xs bg-[#25221F] text-white font-medium px-2 py-0.5 rounded-full">
                {summary.totalQuantity}
              </span>
            </div>
            <button
              onClick={closeCartDrawer}
              aria-label="Close cart drawer"
              className="p-2 text-[#A8A29A] hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {items.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#1E1B18] flex items-center justify-center text-[#7D776E]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-lg text-white">Your bag is empty</h3>
                  <p className="text-xs text-[#A8A29A] max-w-xs mx-auto">
                    Select handcrafted drinks from our Pune menu to schedule a pickup or order instantly.
                  </p>
                </div>
                <div className="pt-2">
                  <Link
                    href="/menu"
                    onClick={closeCartDrawer}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-[#8DA419] text-[#121110] hover:bg-[#A3BA20] px-6 py-3 rounded-full cursor-pointer shadow-md"
                  >
                    Explore Drinks
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                {items.map((item) => (
                  <CartItemRow
                    key={item.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                  />
                ))}

                {/* Preparation Time Notice */}
                <div className="mt-6 p-3 bg-[#1C1A18] rounded-lg flex items-center gap-2.5 text-xs text-[#C4BEB4]">
                  <Clock className="w-4 h-4 text-[#8DA419] shrink-0" />
                  <span>
                    Estimated preparation window:{" "}
                    <strong className="text-white">~{summary.estimatedPrepMinutes} mins</strong> at Pune counter.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Drawer Footer with Totals & CTA */}
          {items.length > 0 && (
            <div className="px-6 py-5 bg-[#1A1816] space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-[#A8A29A]">
                  <span>Item Subtotal</span>
                  <span className="font-medium text-white">
                    {formatINR(summary.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-[#A8A29A]">
                  <span>GST (5%)</span>
                  <span className="font-medium text-white">
                    {formatINR(summary.taxAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-2">
                  <span>Total Amount</span>
                  <span className="text-[#ABC438]">{formatINR(summary.totalAmount)}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Link
                  href="/booking"
                  onClick={closeCartDrawer}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#8DA419] text-[#121110] hover:bg-[#A3BA20] shadow-md transition-all active:scale-[0.99] cursor-pointer"
                >
                  Proceed to Pickup Booking
                  <ArrowRight className="w-4 h-4 text-[#121110]" />
                </Link>

                <div className="flex items-center justify-between text-xs text-[#A8A29A] pt-1">
                  <Link
                    href="/cart"
                    onClick={closeCartDrawer}
                    className="underline hover:text-white"
                  >
                    View detailed bag
                  </Link>
                  <button
                    onClick={closeCartDrawer}
                    className="hover:text-white cursor-pointer"
                  >
                    Continue browsing
                  </button>
                </div>
              </div>
            </div>
          )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
