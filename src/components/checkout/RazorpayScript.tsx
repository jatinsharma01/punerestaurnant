"use client";

import { useEffect } from "react";

/**
 * Dynamically loads the official Razorpay Checkout SDK.
 */
export function useRazorpayScript() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (document.getElementById("razorpay-sdk")) return;

    const script = document.createElement("script");
    script.id = "razorpay-sdk";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Keep script cached in DOM
    };
  }, []);
}
