"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Clock,
  ArrowLeft,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { OrderRecord, OrderStatus } from "@/types/order";
import { formatINR } from "@/lib/currency";
import { formatDisplayDate } from "@/lib/date-time";

interface OrderStatusClientProps {
  orderId: string;
}

const STATUS_PROGRESSION: OrderStatus[] = [
  "confirmed",
  "preparing",
  "ready_for_pickup",
  "completed",
];

export default function OrderStatusClient({ orderId }: OrderStatusClientProps) {
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // 1. Check local storage
    if (typeof window !== "undefined") {
      try {
        const local = localStorage.getItem(`pour_club_order_${orderId}`);
        if (local) {
          const parsed = JSON.parse(local);
          if (parsed && (parsed.id === orderId || !parsed.id)) {
            setOrder(parsed);
          }
        }
      } catch (e) {
        console.warn("Could not read local order:", e);
      }
    }

    // 2. Fetch authoritative order from server API
    async function loadOrder() {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.order && isMounted) {
            setOrder(data.order);
            if (typeof window !== "undefined") {
              try {
                localStorage.setItem(`pour_club_order_${orderId}`, JSON.stringify(data.order));
              } catch {}
            }
          }
        }
      } catch (e) {
        console.error("Error loading order status:", e);
      } finally {
        if (isMounted) setIsLoaded(true);
      }
    }

    loadOrder();

    return () => {
      isMounted = false;
    };
  }, [orderId]);

  const handleAdvanceStatus = async (nextStatus: OrderStatus) => {
    if (!order) return;
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (data.success && data.order) {
        setOrder(data.order);
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(`pour_club_order_${order.id}`, JSON.stringify(data.order));
          } catch {}
        }
      }
    } catch (e) {
      console.warn("Status update fallback error:", e);
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 mx-auto rounded-full border-2 border-[#8DA419] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center space-y-4">
        <div className="w-12 h-12 mx-auto rounded-full bg-red-950/40 text-red-400 flex items-center justify-center">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="font-serif text-2xl text-white">Order Not Found</h2>
        <p className="text-xs text-[#A8A29A]">
          We could not find order #{orderId}. If you just placed an order, please check your network or return to the menu.
        </p>
        <div>
          <Link
            href="/menu"
            className="inline-flex px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#8DA419] text-[#121110] hover:bg-[#A3BA20]"
          >
            Explore Menu
          </Link>
        </div>
      </div>
    );
  }

  const currentIdx = STATUS_PROGRESSION.indexOf(order.status);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
      {/* Top back link */}
      <div>
        <Link
          href="/menu"
          className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-[#A8A29A] hover:text-[#ABC438] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Menu</span>
        </Link>
      </div>

      {/* Main Order Status Header */}
      <div className="bg-[#1C1A18] rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6">
          <div className="space-y-1">
            <span className="text-xs font-semibold tracking-wider uppercase text-[#ABC438]">
              Live Counter Tracker
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl text-white">
              Order #{order.id}
            </h1>
            <p className="text-xs text-[#A8A29A]">
              Booked for <strong className="text-white">{order.booking.customerName}</strong> ({order.booking.customerPhone})
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#232B0D] text-[#ABC438] shadow-xs">
              {order.status.replace(/_/g, " ")}
            </span>
          </div>
        </div>

        {/* Pickup Arrival Time Alert */}
        <div className="p-4 rounded-xl bg-[#221F1C] flex items-start gap-3">
          <Clock className="w-5 h-5 text-[#8DA419] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#ABC438]">
              Pickup Time Commitment
            </h3>
            <p className="text-base font-bold text-white">
              {order.booking.pickupTimeDisplay} • {formatDisplayDate(order.booking.pickupDate)}
            </p>
            <p className="text-xs text-[#A8A29A]">
              Counter: {order.booking.outletName} (In-Store Pre-Booked Counter)
            </p>
          </div>
        </div>

        {/* Visual Stepper Timeline */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">
            Order Progression
          </h4>
          <div className="grid grid-cols-4 gap-1.5 sm:gap-2 text-center">
            {STATUS_PROGRESSION.map((st, i) => {
              const isPast = currentIdx > i;
              const isCurrent = currentIdx === i;

              return (
                <div key={st} className="space-y-1.5 sm:space-y-2">
                  <div
                    className={`h-1.5 sm:h-2 rounded-full transition-all ${
                      isPast || isCurrent ? "bg-[#8DA419]" : "bg-[#282420]"
                    }`}
                  />
                  <span
                    className={`block text-[9px] sm:text-[11px] font-medium capitalize leading-tight ${
                      isCurrent
                        ? "text-white font-bold"
                        : isPast
                        ? "text-[#ABC438]"
                        : "text-[#7D776E]"
                    }`}
                  >
                    {st.replace(/_/g, " ")}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Prototype Demo Status Advance Controller */}
        <div className="pt-4 space-y-2.5 bg-[#221F1C] p-4 rounded-xl">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#8DA419]" />
              Prototype Status Simulator
            </span>
            <span className="text-[10px] text-[#A8A29A]">
              (For UI/UX demonstration)
            </span>
          </div>
          <p className="text-[11px] text-[#A8A29A]">
            Advance barista status to preview each customer state without a physical kitchen terminal:
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {STATUS_PROGRESSION.map((st) => (
              <button
                key={st}
                type="button"
                disabled={updatingStatus}
                onClick={() => handleAdvanceStatus(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all cursor-pointer ${
                  order.status === st
                    ? "bg-[#8DA419] text-[#121110] font-bold shadow-xs"
                    : "bg-[#1C1A18] text-[#C4BEB4] hover:bg-[#25221F]"
                }`}
              >
                Set to {st.replace(/_/g, " ")}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Order Item & Payment Details */}
      <div className="bg-[#1C1A18] rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white pb-1">
          Order Items & Payment
        </h3>

        <div className="space-y-2">
          {order.items.map((item, idx) => (
            <div key={idx} className="p-3 bg-[#221F1C] rounded-xl flex justify-between gap-4 text-xs">
              <div>
                <span className="font-bold text-white">
                  {item.quantity}x {item.drink.name}
                </span>{" "}
                <span className="text-[#A8A29A]">
                  ({item.size.name})
                </span>
                {item.customizations?.length > 0 && (
                  <p className="text-[10px] text-[#ABC438]">
                    +{item.customizations.map((c) => c.option.name).join(", ")}
                  </p>
                )}
              </div>
              <span className="font-bold text-white">
                {formatINR(item.totalPrice)}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-2 flex justify-between items-center text-xs">
          <span className="text-[#A8A29A]">
            Payment Method:{" "}
            <strong className="text-white">
              {order.payment.isDemoTransaction
                ? "Razorpay Test / Demo Mode"
                : "Razorpay Verified"}
            </strong>
          </span>
          <span className="text-base font-bold text-[#ABC438]">
            Total: {formatINR(order.total)}
          </span>
        </div>
      </div>
    </div>
  );
}
