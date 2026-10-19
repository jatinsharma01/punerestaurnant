"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { BookingDetails, PickupMode } from "@/types/booking";
import { PRIMARY_PUNE_OUTLET } from "@/config/outlet";
import {
  formatPuneDate,
  calculateEarliestPickupEstimate,
} from "@/lib/date-time";

interface BookingContextType {
  booking: BookingDetails;
  setMode: (mode: PickupMode) => void;
  setPickupDate: (dateStr: string) => void;
  setPickupTime: (time24: string, timeDisplay: string) => void;
  setCustomerDetails: (details: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    specialInstructions?: string;
  }) => void;
  resetBooking: () => void;
  isReadyForCheckout: boolean;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

const BOOKING_STORAGE_KEY = "pour_club_booking_v1";

const DEFAULT_BOOKING: BookingDetails = {
  outletId: PRIMARY_PUNE_OUTLET.id,
  outletName: PRIMARY_PUNE_OUTLET.name,
  mode: "schedule",
  pickupDate: "",
  pickupTime: "10:00",
  pickupTimeDisplay: "10:00 AM",
  customerName: "",
  customerPhone: "",
  customerEmail: "",
  specialInstructions: "",
};

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [booking, setBooking] = useState<BookingDetails>(DEFAULT_BOOKING);
  const [isClientReady, setIsClientReady] = useState(false);

  // Client hydration: safely evaluate current date/time on mount
  useEffect(() => {
    try {
      const todayPune = formatPuneDate(new Date());
      const earliest = calculateEarliestPickupEstimate(0);
      const stored = localStorage.getItem(BOOKING_STORAGE_KEY);

      if (stored) {
        const parsed = JSON.parse(stored);
        setBooking({
          ...DEFAULT_BOOKING,
          pickupDate: todayPune,
          pickupTime: earliest.time24,
          pickupTimeDisplay: earliest.timeDisplay,
          ...parsed,
          outletId: PRIMARY_PUNE_OUTLET.id,
          outletName: PRIMARY_PUNE_OUTLET.name,
        });
      } else {
        setBooking((prev) => ({
          ...prev,
          pickupDate: todayPune,
          pickupTime: earliest.time24,
          pickupTimeDisplay: earliest.timeDisplay,
        }));
      }
    } catch (e) {
      console.warn("Failed to retrieve booking from localStorage:", e);
    } finally {
      setIsClientReady(true);
    }
  }, []);

  // Save changes
  useEffect(() => {
    if (!isClientReady) return;
    try {
      localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(booking));
    } catch (e) {
      console.warn("Failed to save booking to localStorage:", e);
    }
  }, [booking, isClientReady]);

  const setMode = (mode: PickupMode) => {
    if (mode === "instant") {
      const todayPune = formatPuneDate(new Date());
      const earliest = calculateEarliestPickupEstimate(0);
      setBooking((prev) => ({
        ...prev,
        mode: "instant",
        pickupDate: todayPune,
        pickupTime: earliest.time24,
        pickupTimeDisplay: earliest.timeDisplay,
      }));
    } else {
      setBooking((prev) => ({
        ...prev,
        mode: "schedule",
      }));
    }
  };

  const setPickupDate = (dateStr: string) => {
    setBooking((prev) => ({
      ...prev,
      pickupDate: dateStr,
    }));
  };

  const setPickupTime = (time24: string, timeDisplay: string) => {
    setBooking((prev) => ({
      ...prev,
      pickupTime: time24,
      pickupTimeDisplay: timeDisplay,
    }));
  };

  const setCustomerDetails = (details: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    specialInstructions?: string;
  }) => {
    setBooking((prev) => ({
      ...prev,
      ...details,
    }));
  };

  const resetBooking = () => {
    const todayPune = formatPuneDate(new Date());
    const earliest = calculateEarliestPickupEstimate(0);
    const initial: BookingDetails = {
      ...DEFAULT_BOOKING,
      pickupDate: todayPune,
      pickupTime: earliest.time24,
      pickupTimeDisplay: earliest.timeDisplay,
    };
    setBooking(initial);
    try {
      localStorage.removeItem(BOOKING_STORAGE_KEY);
    } catch {}
  };

  const isReadyForCheckout = Boolean(
    booking.pickupDate &&
    booking.pickupTime &&
    booking.outletId
  );

  return (
    <BookingContext.Provider
      value={{
        booking,
        setMode,
        setPickupDate,
        setPickupTime,
        setCustomerDetails,
        resetBooking,
        isReadyForCheckout,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
}
