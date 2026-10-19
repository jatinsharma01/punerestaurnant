"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import OutletSelector from "@/components/booking/OutletSelector";
import PickupModeSelector from "@/components/booking/PickupModeSelector";
import PickupDatePicker from "@/components/booking/PickupDatePicker";
import PickupTimeSlots from "@/components/booking/PickupTimeSlots";
import { useCart } from "@/context/CartContext";
import { useBooking } from "@/context/BookingContext";
import { formatINR } from "@/lib/currency";
import {
  formatDisplayDate,
  calculateEarliestInstantEstimate,
  generate15MinPickupSlots,
} from "@/lib/date-time";

export default function BookingPage() {
  const router = useRouter();
  const { items, summary, isLoaded } = useCart();
  const { booking, setMode, setPickupDate, setPickupTime } = useBooking();

  const [timeSlots, setTimeSlots] = useState<
    { time24: string; timeDisplay: string; isAvailable: boolean }[]
  >([]);

  const [earliestEstimate, setEarliestEstimate] = useState({
    time24: "08:30",
    timeDisplay: "08:30 AM",
    estimatedMinutesFromNow: 15,
    isAvailableToday: true,
  });

  // Calculate earliest estimate on mount or cart change
  useEffect(() => {
    const est = calculateEarliestInstantEstimate(summary.estimatedPrepMinutes);
    setEarliestEstimate(est);

    // If booking was on instant mode or time is blank, sync with earliest
    if (booking.mode === "instant") {
      setPickupTime(est.time24, est.timeDisplay);
    }
  }, [summary.estimatedPrepMinutes, booking.mode, setPickupTime]);

  // Generate 15-min slots for chosen date
  useEffect(() => {
    const slots = generate15MinPickupSlots(
      booking.pickupDate,
      summary.estimatedPrepMinutes
    );
    setTimeSlots(slots);
  }, [booking.pickupDate, summary.estimatedPrepMinutes]);

  const handleProceedToCheckout = () => {
    router.push("/checkout");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#121110] text-[#F5F3EF]">
      <SiteHeader />

      <main className="flex-1 py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Top navigation */}
          <div className="flex items-center justify-between">
            <Link
              href="/cart"
              className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-[#A8A29A] hover:text-[#ABC438] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Cart</span>
            </Link>

            <div className="flex items-center gap-2 text-xs text-[#A8A29A]">
              <span className="font-semibold text-white">Step 2 of 3:</span>
              <span>Select Pickup Time</span>
            </div>
          </div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-1"
          >
            <span className="text-xs font-semibold tracking-widest uppercase text-[#ABC438]">
              Pune Outlet Reservation
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-white">
              Choose Your Pickup Time
            </h1>
            <p className="text-sm text-[#A8A29A] max-w-xl">
              Select whether you want to pick up immediately or reserve a dedicated arrival slot at our Pune counter.
            </p>
          </motion.div>

          {/* Empty cart warning if user directly navigated to /booking */}
          {isLoaded && items.length === 0 && (
            <div className="p-4 rounded-xl bg-amber-950/40 flex items-center justify-between gap-4 text-xs text-amber-200">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  Your cart is currently empty. You can still review available pickup slots, but drinks must be added before checkout.
                </span>
              </div>
              <Link
                href="/menu"
                className="font-semibold underline hover:text-white shrink-0"
              >
                Go to Menu &rarr;
              </Link>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left 7 Columns: Outlet, Mode, Date, Time Slots */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-7 space-y-8"
            >
              {/* 1. Outlet Card */}
              <OutletSelector />

              {/* 2. Pickup Mode Selector (Schedule vs Instant) */}
              <div className="bg-[#1C1A18] rounded-2xl p-4 sm:p-6 md:p-7 space-y-6 shadow-xl">
                <PickupModeSelector
                  mode={booking.mode}
                  onChangeMode={setMode}
                  earliestEstimate={earliestEstimate}
                />

                {/* If Mode is Instant: display confirmation box */}
                {booking.mode === "instant" && (
                  <div className="p-5 bg-[#232B0D] rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#ABC438] uppercase tracking-wider">
                      <Clock className="w-4 h-4 text-[#8DA419]" />
                      <span>Instant Preparation Estimate</span>
                    </div>
                    <div className="text-xl font-bold text-white">
                      Ready at ~{earliestEstimate.timeDisplay} (Today)
                    </div>
                    <p className="text-xs text-[#C4BEB4] leading-relaxed">
                      Based on current kitchen queue and ~{earliestEstimate.estimatedMinutesFromNow} minutes preparation lead time. Exact pickup slot is finalized upon payment confirmation.
                    </p>
                  </div>
                )}

                {/* If Mode is Schedule: display DatePicker and TimeSlots */}
                {booking.mode === "schedule" && (
                  <div className="space-y-6 pt-4">
                    <PickupDatePicker
                      selectedDate={booking.pickupDate}
                      onSelectDate={setPickupDate}
                    />

                    <PickupTimeSlots
                      slots={timeSlots}
                      selectedTime={booking.pickupTime}
                      onSelectSlot={(slot) =>
                        setPickupTime(slot.time24, slot.timeDisplay)
                      }
                    />
                  </div>
                )}
              </div>
            </motion.div>

            {/* Right 5 Columns: Booking Summary & Checkout Action */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-5 space-y-6"
            >
              <div className="bg-[#1C1A18] rounded-2xl p-4 sm:p-6 md:p-8 space-y-6 shadow-xl sticky top-28">
                <h3 className="font-serif text-xl text-white pb-4">
                  Pickup Summary
                </h3>

                <div className="space-y-4 text-xs">
                  {/* Outlet */}
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[#A8A29A]">Pickup Outlet</span>
                    <span className="font-bold text-white text-right">
                      {booking.outletName}
                    </span>
                  </div>

                  {/* Mode */}
                  <div className="flex justify-between items-center">
                    <span className="text-[#A8A29A]">Order Mode</span>
                    <span className="font-bold text-white capitalize">
                      {booking.mode === "instant" ? "Instant (Earliest)" : "Scheduled Ahead"}
                    </span>
                  </div>

                  {/* Date & Time */}
                  <div className="flex justify-between items-start gap-2 pt-3">
                    <span className="text-[#A8A29A]">Pickup Time</span>
                    <div className="text-right">
                      <div className="font-bold text-sm text-white">
                        {booking.pickupTimeDisplay}
                      </div>
                      <div className="text-[11px] text-[#ABC438]">
                        {formatDisplayDate(booking.pickupDate)}
                      </div>
                    </div>
                  </div>

                  {/* Cart Items list */}
                  <div className="pt-3 space-y-2">
                    <div className="flex justify-between items-center text-[#A8A29A]">
                      <span>Items in Bag ({summary.totalQuantity})</span>
                      <Link href="/cart" className="text-[#ABC438] font-medium hover:underline">
                        Edit
                      </Link>
                    </div>

                    {items.map((it) => (
                      <div key={it.id} className="flex justify-between text-[#C4BEB4]">
                        <span className="truncate max-w-[200px]">
                          {it.quantity}x {it.drink.name} ({it.size.name})
                        </span>
                        <span className="font-medium text-white">{formatINR(it.totalPrice)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Price breakdown */}
                  <div className="pt-3 space-y-1.5">
                    <div className="flex justify-between text-[#A8A29A]">
                      <span>Subtotal</span>
                      <span className="text-white">{formatINR(summary.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-[#A8A29A]">
                      <span>GST (5%)</span>
                      <span className="text-white">{formatINR(summary.taxAmount)}</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-white pt-2">
                      <span>Total Amount</span>
                      <span className="text-lg text-[#ABC438]">{formatINR(summary.totalAmount)}</span>
                    </div>
                  </div>
                </div>

                {/* Continue to Checkout */}
                <div className="space-y-3 pt-2">
                  <motion.button
                    type="button"
                    whileHover={items.length > 0 && booking.pickupTime ? { scale: 1.02 } : undefined}
                    whileTap={items.length > 0 && booking.pickupTime ? { scale: 0.98 } : undefined}
                    disabled={items.length === 0 || !booking.pickupTime}
                    onClick={handleProceedToCheckout}
                    className={`w-full flex items-center justify-center gap-2 py-4 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors shadow-md cursor-pointer ${
                      items.length === 0 || !booking.pickupTime
                        ? "opacity-40 cursor-not-allowed bg-[#282420] text-[#7D776E]"
                        : "bg-[#8DA419] text-[#121110] hover:bg-[#A3BA20]"
                    }`}
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4 text-[#121110]" />
                  </motion.button>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#A8A29A]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#8DA419]" />
                    <span>Slot held during checkout • Razorpay Test Mode</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
