"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ShoppingBag, Clock, ShieldCheck, MapPin } from "lucide-react";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import CartItemRow from "@/components/cart/CartItemRow";
import { useCart } from "@/context/CartContext";
import { formatINR } from "@/lib/currency";
import { PRIMARY_PUNE_OUTLET } from "@/config/outlet";

export default function CartPage() {
  const { items, summary, isLoaded, updateQuantity, removeItem, clearCart } = useCart();

  if (!isLoaded) {
    return (
      <div className="flex flex-col min-h-screen bg-[#121110] text-[#F5F3EF]">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center py-24">
          <div className="w-8 h-8 rounded-full border-2 border-[#8DA419] border-t-transparent animate-spin" />
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#121110] text-[#F5F3EF]">
      <SiteHeader />

      <main className="flex-1 py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Top Breadcrumb / Back Link */}
          <div className="flex items-center justify-between">
            <Link
              href="/menu"
              className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-[#A8A29A] hover:text-[#ABC438] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>

            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-[#7D776E] hover:text-red-400 transition-colors cursor-pointer"
              >
                Clear Entire Bag
              </button>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-1"
          >
            <span className="text-xs font-semibold tracking-widest uppercase text-[#ABC438]">
              Review Your Selections
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-white">
              Your Order Bag
            </h1>
          </motion.div>

          {items.length === 0 ? (
            <div className="bg-[#1C1A18] rounded-2xl py-20 px-4 text-center space-y-5 max-w-xl mx-auto shadow-xl">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#24201D] flex items-center justify-center text-[#7D776E]">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h2 className="font-serif text-2xl text-white">
                  Your bag is empty
                </h2>
                <p className="text-sm text-[#A8A29A]">
                  You haven&apos;t selected any beverages yet. Explore our handcrafted menu to build your order for in-store pickup in Pune.
                </p>
              </div>
              <div>
                <Link
                  href="/menu"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#8DA419] text-[#121110] hover:bg-[#A3BA20] transition-all cursor-pointer shadow-md"
                >
                  <span>Explore Menu</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left Column: Items List */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-7 bg-[#1C1A18] rounded-2xl p-4 sm:p-6 md:p-8 space-y-2 shadow-xl"
              >
                <div className="flex items-center justify-between pb-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                    Items ({summary.totalQuantity})
                  </h3>
                  <span className="text-xs text-[#A8A29A]">
                    Pickup at: {PRIMARY_PUNE_OUTLET.name}
                  </span>
                </div>

                <div className="space-y-3">
                  {items.map((item) => (
                    <CartItemRow
                      key={item.id}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeItem}
                    />
                  ))}
                </div>

                {/* Outlet notice */}
                <div className="mt-6 pt-4 flex items-start gap-2.5 text-xs text-[#A8A29A]">
                  <MapPin className="w-4 h-4 text-[#8DA419] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-white">
                      In-Store Pickup Only:
                    </span>{" "}
                    Drinks will be prepared fresh for collection at the Pune counter. No home delivery service.
                  </div>
                </div>
              </motion.div>

              {/* Right Column: Order Summary & Checkout Stepper */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="lg:col-span-5 space-y-6"
              >
                <div className="bg-[#1C1A18] rounded-2xl p-4 sm:p-6 md:p-8 space-y-6 shadow-xl">
                  <h3 className="font-serif text-xl text-white pb-4">
                    Order Summary
                  </h3>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-[#A8A29A]">
                      <span>Items Subtotal ({summary.totalQuantity} drinks)</span>
                      <span className="font-semibold text-white">
                        {formatINR(summary.subtotal)}
                      </span>
                    </div>

                    <div className="flex justify-between text-[#A8A29A]">
                      <span>GST (5% Indian Cafe Tax)</span>
                      <span className="font-semibold text-white">
                        {formatINR(summary.taxAmount)}
                      </span>
                    </div>

                    <div className="flex justify-between text-base font-bold text-white pt-4">
                      <span>Total Amount (INR)</span>
                      <span className="text-xl text-[#ABC438]">{formatINR(summary.totalAmount)}</span>
                    </div>
                  </div>

                  {/* Kitchen Lead Notice */}
                  <div className="p-3.5 bg-[#24201D] rounded-xl flex items-center gap-3 text-xs text-[#C4BEB4]">
                    <Clock className="w-5 h-5 text-[#8DA419] shrink-0" />
                    <span>
                      Estimated preparation: <strong className="text-white">~{summary.estimatedPrepMinutes} mins</strong> lead time.
                    </span>
                  </div>

                  {/* Proceed to Booking */}
                  <div className="space-y-3 pt-2">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Link
                        href="/booking"
                        className="w-full flex items-center justify-center gap-2 py-4 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider bg-[#8DA419] text-[#121110] hover:bg-[#A3BA20] transition-colors shadow-md cursor-pointer"
                      >
                        <span>Proceed to Pickup Booking</span>
                        <ArrowRight className="w-4 h-4 text-[#121110]" />
                      </Link>
                    </motion.div>

                    <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#A8A29A]">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#8DA419]" />
                      <span>Next: Select your arrival time in Pune</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
