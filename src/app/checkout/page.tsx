"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  Clock,
  MapPin,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import { useCart } from "@/context/CartContext";
import { useBooking } from "@/context/BookingContext";
import { formatINR } from "@/lib/currency";
import { formatDisplayDate } from "@/lib/date-time";
import {
  validateCustomerName,
  validateIndianMobileNumber,
  validateEmail,
} from "@/lib/validation";
import { PRIMARY_PUNE_OUTLET } from "@/config/outlet";
import { useRazorpayScript } from "@/components/checkout/RazorpayScript";

declare global {
  interface Window {
    Razorpay?: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  useRazorpayScript();

  const { items, summary, isLoaded, clearCart } = useCart();
  const { booking, setCustomerDetails } = useBooking();

  // Form fields
  const [name, setName] = useState(booking.customerName || "");
  const [phone, setPhone] = useState(booking.customerPhone || "");
  const [email, setEmail] = useState(booking.customerEmail || "");
  const [instructions, setInstructions] = useState(booking.specialInstructions || "");

  // UI & Error states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [demoNotice, setDemoNotice] = useState<string | null>(null);

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    const nameVal = validateCustomerName(name);
    if (!nameVal.valid) {
      newErrors.name = nameVal.error || "Please enter your name.";
    }

    const phoneVal = validateIndianMobileNumber(phone);
    if (!phoneVal.valid) {
      newErrors.phone = phoneVal.error || "Please enter a valid 10-digit mobile number.";
    }

    if (email && !validateEmail(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Trigger payment flow
  const handleInitiatePayment = async () => {
    setPaymentError(null);
    setDemoNotice(null);

    if (!validateForm()) {
      return;
    }

    if (items.length === 0) {
      setPaymentError("Your bag is empty. Please add drinks before checking out.");
      return;
    }

    if (!booking.pickupTime || !booking.pickupDate) {
      setPaymentError("Please select a pickup time in the booking step.");
      return;
    }

    setIsProcessing(true);

    try {
      // Save customer details in context
      setCustomerDetails({
        customerName: name.trim(),
        customerPhone: phone.trim(),
        customerEmail: email.trim(),
        specialInstructions: instructions.trim(),
      });

      // 1. Create order on server
      const createRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          booking: {
            ...booking,
            customerName: name.trim(),
            customerPhone: phone.trim(),
            customerEmail: email.trim(),
            specialInstructions: instructions.trim(),
          },
        }),
      });

      const orderData = await createRes.json();

      if (!createRes.ok || !orderData.success) {
        throw new Error(orderData.error || "Failed to initiate payment order.");
      }

      // Check if real Razorpay keys are loaded and SDK is available
      const hasLiveRazorpay =
        typeof window !== "undefined" &&
        window.Razorpay &&
        orderData.keyId &&
        orderData.keyId !== "rzp_test_placeholder" &&
        !orderData.isDemoMode;

      if (hasLiveRazorpay) {
        // Open standard Razorpay Checkout
        const options = {
          key: orderData.keyId,
          amount: orderData.amountPaise,
          currency: orderData.currency,
          name: "POUR CLUB",
          description: `Pune Pickup • ${orderData.pickupTimeDisplay}`,
          order_id: orderData.razorpayOrderId,
          prefill: {
            name: name.trim(),
            contact: phone.trim(),
            email: email.trim() || undefined,
          },
          theme: {
            color: "#181614",
          },
          modal: {
            ondismiss: () => {
              setIsProcessing(false);
            },
          },
          handler: async (response: any) => {
            await verifyPayment({
              orderId: orderData.orderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              isDemoPayment: false,
            });
          },
        };

        const rzpInstance = new window.Razorpay(options);
        rzpInstance.open();
      } else {
        // DEMO MODE: Keys not configured or running local mock
        setDemoNotice(
          "Running in Demo Mode: RAZORPAY_KEY_ID is not configured in .env.local. You can complete this simulated checkout to verify order creation and pickup confirmation."
        );

        // Auto verify demo payment after brief realistic delay
        await verifyPayment({
          orderId: orderData.orderId,
          razorpay_order_id: orderData.razorpayOrderId,
          razorpay_payment_id: `pay_demo_${orderData.orderId}`,
          razorpay_signature: "mock_signature_demo",
          isDemoPayment: true,
        });
      }
    } catch (err: any) {
      console.error("Payment initiation failed:", err);
      setPaymentError(err.message || "An error occurred during checkout.");
      setIsProcessing(false);
    }
  };

  // Verify payment on server
  const verifyPayment = async (verificationPayload: any) => {
    try {
      const verifyRes = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(verificationPayload),
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok || !verifyData.success) {
        throw new Error(verifyData.error || "Payment verification failed.");
      }

      // Successful payment verified!
      if (typeof window !== "undefined" && verifyData.order) {
        try {
          localStorage.setItem(`pour_club_order_${verificationPayload.orderId}`, JSON.stringify(verifyData.order));
          localStorage.setItem("pour_club_last_order", JSON.stringify(verifyData.order));
        } catch (e) {
          console.warn("Could not save order to localStorage:", e);
        }
      }
      clearCart();
      router.push(`/order/success?orderId=${verificationPayload.orderId}`);
    } catch (error: any) {
      setPaymentError(
        error.message || "Payment verification failed. Your card was not charged."
      );
      setIsProcessing(false);
    }
  };

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
          {/* Top navigation */}
          <div className="flex items-center justify-between">
            <Link
              href="/booking"
              className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-[#A8A29A] hover:text-[#ABC438] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Pickup Slot</span>
            </Link>

            <div className="flex items-center gap-2 text-xs text-[#A8A29A]">
              <span className="font-semibold text-white">Step 3 of 3:</span>
              <span>Checkout & Payment</span>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-1"
          >
            <span className="text-xs font-semibold tracking-widest uppercase text-[#ABC438]">
              Final Step • Secure Payment
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-white">
              Complete Your Pickup Order
            </h1>
          </motion.div>

          {/* Payment Error Alert */}
          {paymentError && (
            <div className="p-4 rounded-xl bg-red-950/40 text-xs text-red-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-red-200">Payment Error:</strong> {paymentError}
              </div>
            </div>
          )}

          {/* Demo Notice */}
          {demoNotice && (
            <div className="p-4 rounded-xl bg-amber-950/40 text-xs text-amber-300 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-[#ABC438] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#ABC438]">Demo Mode Active:</strong> {demoNotice}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left 7 Columns: Customer Details Form & Outlet confirmation */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-7 space-y-8"
            >
              {/* Customer Contact Details */}
              <div className="bg-[#1C1A18] rounded-2xl p-4 sm:p-6 md:p-8 space-y-6 shadow-xl">
                <div className="pb-4">
                  <h3 className="font-serif text-xl text-white">
                    Customer Details
                  </h3>
                  <p className="text-xs text-[#A8A29A] mt-1">
                    Used to match your order at the Pune pickup counter and send verification SMS.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Name field */}
                  <div>
                    <label
                      htmlFor="customer-name"
                      className="block text-xs font-bold uppercase tracking-wider text-white mb-1.5"
                    >
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="customer-name"
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                      }}
                      placeholder="e.g. Rohan Joshi"
                      className={`w-full px-4 py-3 rounded-xl text-base sm:text-sm text-white placeholder-[#7D776E] bg-[#24201D] focus:outline-none transition-all ${
                        errors.name
                          ? "ring-1 ring-red-500 focus:ring-red-500"
                          : "focus:ring-2 focus:ring-[#8DA419]"
                      }`}
                    />
                    {errors.name && (
                      <p className="text-xs text-red-400 mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Phone number field */}
                  <div>
                    <label
                      htmlFor="customer-phone"
                      className="block text-xs font-bold uppercase tracking-wider text-white mb-1.5"
                    >
                      Mobile Number (+91) <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-sm font-semibold text-[#A8A29A]">
                        +91
                      </span>
                      <input
                        id="customer-phone"
                        type="tel"
                        maxLength={10}
                        value={phone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          setPhone(val);
                          if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
                        }}
                        placeholder="98765 43210"
                        className={`w-full pl-14 pr-4 py-3 rounded-xl text-base sm:text-sm text-white placeholder-[#7D776E] bg-[#24201D] focus:outline-none transition-all ${
                          errors.phone
                            ? "ring-1 ring-red-500 focus:ring-red-500"
                            : "focus:ring-2 focus:ring-[#8DA419]"
                        }`}
                      />
                    </div>
                    {errors.phone ? (
                      <p className="text-xs text-red-400 mt-1">{errors.phone}</p>
                    ) : (
                      <p className="text-[11px] text-[#A8A29A] mt-1">
                        10-digit Indian mobile number for instant pickup updates
                      </p>
                    )}
                  </div>

                  {/* Email address field (optional) */}
                  <div>
                    <label
                      htmlFor="customer-email"
                      className="block text-xs font-bold uppercase tracking-wider text-white mb-1.5"
                    >
                      Email Address <span className="text-[#A8A29A] font-normal">(Optional)</span>
                    </label>
                    <input
                      id="customer-email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                      }}
                      placeholder="rohan@example.com"
                      className={`w-full px-4 py-3 rounded-xl text-base sm:text-sm text-white placeholder-[#7D776E] bg-[#24201D] focus:outline-none transition-all ${
                        errors.email
                          ? "ring-1 ring-red-500 focus:ring-red-500"
                          : "focus:ring-2 focus:ring-[#8DA419]"
                      }`}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-400 mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Special barista notes */}
                  <div>
                    <label
                      htmlFor="special-notes"
                      className="block text-xs font-bold uppercase tracking-wider text-white mb-1.5"
                    >
                      Barista Notes <span className="text-[#A8A29A] font-normal">(Optional)</span>
                    </label>
                    <input
                      id="special-notes"
                      type="text"
                      maxLength={120}
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      placeholder="e.g. Extra hot espresso shot, separate carry sleeve..."
                      className="w-full px-4 py-3 rounded-xl text-base sm:text-sm text-white placeholder-[#7D776E] bg-[#24201D] focus:outline-none focus:ring-2 focus:ring-[#8DA419] transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Outlet & Arrival Commitment Recap */}
              <div className="bg-[#221F1C] rounded-2xl p-4 sm:p-6 space-y-3 shadow-xl">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white">
                  <MapPin className="w-4 h-4 text-[#8DA419]" />
                  <span>Pickup Destination</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white">
                    {PRIMARY_PUNE_OUTLET.name}
                  </h4>
                  <p className="text-xs text-[#A8A29A]">
                    {PRIMARY_PUNE_OUTLET.addressPlaceholder}
                  </p>
                </div>
                <div className="pt-2 flex items-center gap-2 text-xs text-[#C4BEB4]">
                  <Clock className="w-4 h-4 text-[#8DA419] shrink-0" />
                  <span>
                    Your drink will be ready at:{" "}
                    <strong className="text-white">{booking.pickupTimeDisplay}</strong> (
                    {formatDisplayDate(booking.pickupDate)})
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Right 5 Columns: Final Order Summary & Razorpay Trigger */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-5 space-y-6"
            >
              <div className="bg-[#1C1A18] rounded-2xl p-4 sm:p-6 md:p-8 space-y-6 shadow-xl sticky top-28">
                <h3 className="font-serif text-xl text-white pb-4">
                  Order & Payment
                </h3>

                {/* Items preview */}
                <div className="space-y-3 text-xs max-h-56 overflow-y-auto pr-1">
                  {items.map((it) => (
                    <div
                      key={it.id}
                      className="flex items-start justify-between gap-2 pb-2"
                    >
                      <div>
                        <p className="font-semibold text-white">
                          {it.quantity}x {it.drink.name}
                        </p>
                        <p className="text-[11px] text-[#A8A29A]">
                          {it.size.name}
                          {it.sugarLevel ? ` • ${it.sugarLevel}` : ""}
                          {it.iceLevel ? ` • ${it.iceLevel}` : ""}
                        </p>
                        {it.customizations.length > 0 && (
                          <p className="text-[10px] text-[#ABC438]">
                            +{it.customizations.map((c) => c.option.name).join(", ")}
                          </p>
                        )}
                      </div>
                      <span className="font-bold text-white shrink-0">
                        {formatINR(it.totalPrice)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-2 text-xs pt-4">
                  <div className="flex justify-between text-[#A8A29A]">
                    <span>Subtotal</span>
                    <span className="font-medium text-white">
                      {formatINR(summary.subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#A8A29A]">
                    <span>GST (5% Indian Cafe Rate)</span>
                    <span className="font-medium text-white">
                      {formatINR(summary.taxAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-white pt-2">
                    <span>Total Amount (INR)</span>
                    <span className="text-[#ABC438]">{formatINR(summary.totalAmount)}</span>
                  </div>
                </div>

                {/* Payment CTA */}
                <div className="space-y-3 pt-2">
                  <motion.button
                    type="button"
                    whileHover={!isProcessing && items.length > 0 ? { scale: 1.02 } : undefined}
                    whileTap={!isProcessing && items.length > 0 ? { scale: 0.98 } : undefined}
                    disabled={isProcessing || items.length === 0}
                    onClick={handleInitiatePayment}
                    className={`w-full flex items-center justify-center gap-2.5 py-4 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors shadow-md cursor-pointer ${
                      isProcessing
                        ? "bg-[#282420] text-[#A8A29A] cursor-wait"
                        : "bg-[#8DA419] text-[#121110] hover:bg-[#A3BA20]"
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-[#121110] border-t-transparent animate-spin" />
                        <span>Verifying & Opening Payment...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 text-[#121110]" />
                        <span>Pay {formatINR(summary.totalAmount)} via Razorpay</span>
                      </>
                    )}
                  </motion.button>

                  <div className="space-y-1.5 text-center">
                    <p className="flex items-center justify-center gap-1.5 text-[11px] text-[#A8A29A]">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#8DA419]" />
                      <span>Official Razorpay Checkout Integration</span>
                    </p>
                    <p className="text-[10px] text-[#A8A29A]">
                      Supports UPI, Cards, Netbanking & Wallets in Test Mode
                    </p>
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
