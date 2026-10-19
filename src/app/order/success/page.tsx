"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  MapPin,
  ArrowRight,
  ExternalLink,
  ShoppingBag,
} from "lucide-react";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import { OrderRecord } from "@/types/order";
import { formatINR } from "@/lib/currency";
import { formatDisplayDate } from "@/lib/date-time";

type StoredOrder = OrderRecord;

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<StoredOrder | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  const loadOrder = React.useCallback(async (id: string) => {
    // 1. Check local storage for instantaneous display
    if (typeof window !== "undefined") {
      try {
        const stored =
          localStorage.getItem(`pour_club_order_${id}`) ||
          localStorage.getItem("pour_club_last_order");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && (parsed.id === id || !id)) {
            setOrder(parsed);
          }
        }
      } catch (e) {
        console.warn("Could not parse cached order:", e);
      }
    }

    // 2. Fetch authoritative order record from server API
    try {
      const res = await fetch(`/api/orders/${id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.order) {
          setOrder(data.order);
          if (typeof window !== "undefined") {
            try {
              localStorage.setItem(`pour_club_order_${id}`, JSON.stringify(data.order));
            } catch {}
          }
        }
      }
    } catch (err) {
      console.error("Failed fetching order from server:", err);
    } finally {
      setIsLoaded(true);
      setIsRetrying(false);
    }
  }, []);

  useEffect(() => {
    if (orderId) {
      loadOrder(orderId);
    } else {
      setIsLoaded(true);
    }
  }, [orderId, loadOrder]);

  if (!isLoaded) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-10 h-10 mx-auto rounded-full border-2 border-[#8DA419] border-t-transparent animate-spin" />
        <p className="text-xs font-semibold uppercase tracking-wider text-[#ABC438]">
          Retrieving order details...
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-16 h-16 mx-auto rounded-full bg-[#1C1A18] flex items-center justify-center text-[#7D776E]">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="font-serif text-2xl text-white">No Order Found</h2>
          <p className="text-xs text-[#A8A29A]">
            We couldn&apos;t retrieve the order details for #{orderId || "unknown"}. If you just placed this order, please click retry or contact our Pune baristas.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {orderId && (
            <button
              onClick={() => {
                setIsRetrying(true);
                loadOrder(orderId);
              }}
              disabled={isRetrying}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider bg-[#8DA419] text-[#121110] hover:bg-[#A3BA20] transition-colors cursor-pointer"
            >
              <span>{isRetrying ? "Checking..." : "Retry Order Lookup"}</span>
            </button>
          )}
          <Link
            href="/menu"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider bg-[#1C1A18] text-white hover:bg-[#25221F] transition-colors"
          >
            <span>Return to Menu</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-8"
    >
      {/* Confirmed Banner */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 320, damping: 18, delay: 0.1 }}
          className="w-16 h-16 mx-auto rounded-full bg-[#232B0D] flex items-center justify-center text-[#ABC438] shadow-lg"
        >
          <CheckCircle2 className="w-10 h-10 text-[#ABC438]" />
        </motion.div>

        <div className="space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-widest text-[#ABC438]">
            Order Confirmed & Verified
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-white">
            Thank you, {(order.customer?.name || order.booking.customerName || "Friend").split(" ")[0]}!
          </h1>
          <p className="text-sm text-[#A8A29A] max-w-md mx-auto">
            Order <strong className="text-white">#{order.id}</strong> has been received by our baristas at {order.booking.outletName}.
          </p>
        </div>

        {/* Pickup Arrival Time Highlight Card */}
        <div className="p-5 rounded-2xl bg-[#232B0D] max-w-md mx-auto space-y-2 text-left shadow-xl">
          <div className="flex items-center justify-between text-xs text-[#A8A29A]">
            <span className="flex items-center gap-1.5 font-medium text-white">
              <Clock className="w-4 h-4 text-[#8DA419]" />
              Pickup Commitment
            </span>
            <span className="text-[#121110] font-bold uppercase text-[10px] bg-[#8DA419] px-2 py-0.5 rounded shadow-xs">
              Ready on Time
            </span>
          </div>

          <div className="text-2xl font-bold text-white">
            {order.booking.pickupTimeDisplay}
          </div>

          <div className="text-xs text-[#C4BEB4] flex items-center gap-2">
            <span>{formatDisplayDate(order.booking.pickupDate)}</span>
            <span>•</span>
            <span className="capitalize">{order.booking.mode} Pickup</span>
          </div>
        </div>

        {/* Demo status tag if applicable */}
        {order.payment.isDemoTransaction && (
          <p className="text-[11px] text-[#7D776E] max-w-sm mx-auto">
            *Test Mode: Completed using demo payment verification.
          </p>
        )}
      </div>

      {/* Pickup Instructions Card */}
      <div className="bg-[#1C1A18] rounded-2xl p-4 sm:p-6 space-y-3 shadow-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#8DA419]" />
          <span>In-Store Collection Instructions</span>
        </h3>
        <ul className="space-y-2 text-xs text-[#C4BEB4]">
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-[#25221F] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
              1
            </span>
            <span>
              Arrive at <strong className="text-white">{order.booking.outletName}</strong> around{" "}
              <strong className="text-white">{order.booking.pickupTimeDisplay}</strong>.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-[#25221F] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
              2
            </span>
            <span>
              Head directly to the dedicated <strong className="text-white">Pre-Booked Counter</strong>. Skip the ordering register.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-[#25221F] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
              3
            </span>
            <span>
              Quote your order number <strong className="text-white">#{order.id}</strong> or show your confirmation to collect your fresh beverage.
            </span>
          </li>
        </ul>
      </div>

      {/* Order Items Breakdown */}
      <div className="bg-[#1C1A18] rounded-2xl p-4 sm:p-6 md:p-8 space-y-4 shadow-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white pb-3">
          Drink Details
        </h3>

        <div className="space-y-3">
          {order.items.map((item, idx) => (
            <div key={idx} className="py-2 flex items-start justify-between gap-4 text-xs">
              <div>
                <p className="font-bold text-sm text-white">
                  {item.quantity}x {item.drink.name}
                </p>
                <p className="text-[#A8A29A] mt-0.5">
                  Size: {item.size.name} ({item.size.volume})
                  {item.sugarLevel ? ` • ${item.sugarLevel}` : ""}
                  {item.iceLevel ? ` • ${item.iceLevel}` : ""}
                </p>
                {item.customizations?.length > 0 && (
                  <p className="text-[10px] text-[#ABC438] mt-0.5">
                    +{item.customizations.map((c) => c.option.name).join(", ")}
                  </p>
                )}
              </div>
              <span className="font-bold text-sm text-white">
                {formatINR(item.totalPrice)}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-3 space-y-1 text-xs">
          <div className="flex justify-between text-[#A8A29A]">
            <span>Subtotal</span>
            <span className="text-white">{formatINR(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-[#A8A29A]">
            <span>GST (5%)</span>
            <span className="text-white">{formatINR(order.tax)}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-white pt-2">
            <span>Total Paid (INR)</span>
            <span className="text-[#ABC438]">{formatINR(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Navigation Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
          <Link
            href={`/orders/${order.id}`}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#8DA419] text-[#121110] hover:bg-[#A3BA20] cursor-pointer shadow-md"
          >
            <span>Track Live Order Status</span>
            <ExternalLink className="w-4 h-4 text-[#121110]" />
          </Link>
        </motion.div>

        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
          <Link
            href="/menu"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#1C1A18] text-white hover:bg-[#25221F] cursor-pointer"
          >
            <span>Order More Drinks</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function OrderSuccessPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#121110] text-[#F5F3EF]">
      <SiteHeader />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="py-24 text-center">
              <div className="w-8 h-8 mx-auto rounded-full border-2 border-[#8DA419] border-t-transparent animate-spin" />
            </div>
          }
        >
          <OrderSuccessContent />
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  );
}
