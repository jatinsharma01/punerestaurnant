"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PickupMode } from "@/types/booking";
import { Calendar, Zap, AlertCircle, Clock } from "lucide-react";
import { isPuneOutletOpenNow } from "@/lib/date-time";

interface PickupModeSelectorProps {
  mode: PickupMode;
  onChangeMode: (mode: PickupMode) => void;
  earliestEstimate: {
    time24: string;
    timeDisplay: string;
    estimatedMinutesFromNow: number;
    isAvailableToday: boolean;
  };
}

export default function PickupModeSelector({
  mode,
  onChangeMode,
  earliestEstimate,
}: PickupModeSelectorProps) {
  const [outletStatus, setOutletStatus] = useState({
    isOpen: true,
    statusText: "Open 08:00 AM – 11:00 PM IST",
  });

  useEffect(() => {
    setOutletStatus(isPuneOutletOpenNow());
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-white">
          Choose Your Ordering Mode
        </label>
        <span className="text-xs text-[#A8A29A]">
          In-Store Pickup at Pune Counter
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Mode 1: Schedule Ahead */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
          onClick={() => onChangeMode("schedule")}
          className={`p-5 rounded-2xl text-left transition-colors cursor-pointer flex flex-col justify-between space-y-4 shadow-xl ${
            mode === "schedule"
              ? "bg-[#232B0D] ring-2 ring-[#8DA419]"
              : "bg-[#1C1A18] hover:bg-[#221F1C]"
          }`}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#25221F] flex items-center justify-center text-[#ABC438]">
                <Calendar className="w-5 h-5 text-[#ABC438]" />
              </div>
              {mode === "schedule" && (
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#8DA419] text-[#121110] px-2.5 py-0.5 rounded-full shadow-xs">
                  Selected
                </span>
              )}
            </div>
            <div>
              <h4 className="font-serif text-lg text-white">
                Schedule a Pickup
              </h4>
              <p className="text-xs text-[#A8A29A] mt-1 leading-relaxed">
                Choose a future date and specific 15-minute slot. Ideal for planning evening arrivals, lunch breaks, or daily commutes.
              </p>
            </div>
          </div>

          <div className="text-[11px] font-semibold text-[#ABC438] pt-2">
            ✓ Up to 7 days ahead in Asia/Kolkata time
          </div>
        </motion.button>

        {/* Mode 2: Order Now / Instant Pickup */}
        <motion.button
          type="button"
          whileHover={outletStatus.isOpen ? { scale: 1.015 } : undefined}
          whileTap={outletStatus.isOpen ? { scale: 0.985 } : undefined}
          onClick={() => {
            if (outletStatus.isOpen) {
              onChangeMode("instant");
            }
          }}
          disabled={!outletStatus.isOpen}
          className={`p-5 rounded-2xl text-left transition-colors cursor-pointer flex flex-col justify-between space-y-4 shadow-xl ${
            !outletStatus.isOpen
              ? "opacity-50 cursor-not-allowed bg-[#141210]"
              : mode === "instant"
              ? "bg-[#232B0D] ring-2 ring-[#8DA419]"
              : "bg-[#1C1A18] hover:bg-[#221F1C]"
          }`}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#25221F] flex items-center justify-center text-[#ABC438]">
                <Zap className="w-5 h-5 text-[#ABC438]" />
              </div>
              {mode === "instant" && (
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#8DA419] text-[#121110] px-2.5 py-0.5 rounded-full shadow-xs">
                  Selected
                </span>
              )}
            </div>
            <div>
              <h4 className="font-serif text-lg text-white">
                Order Now (Earliest Pickup)
              </h4>
              <p className="text-xs text-[#A8A29A] mt-1 leading-relaxed">
                Prepare right away. Your beverages will enter the kitchen queue immediately with the earliest available pickup slot.
              </p>
            </div>
          </div>

          <div className="pt-2">
            {outletStatus.isOpen ? (
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-white">
                <Clock className="w-3.5 h-3.5 text-[#ABC438]" />
                <span>
                  Earliest Estimate: {earliestEstimate.timeDisplay} (~{earliestEstimate.estimatedMinutesFromNow}m)
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-[11px] text-amber-400">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Outlet closed now • Instant ordering unavailable</span>
              </div>
            )}
          </div>
        </motion.button>
      </div>
    </div>
  );
}
