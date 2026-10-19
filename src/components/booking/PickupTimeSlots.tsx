"use client";

import React from "react";
import { motion } from "framer-motion";
import { PickupTimeSlot } from "@/types/booking";
import { Clock, Info } from "lucide-react";

interface PickupTimeSlotsProps {
  slots: PickupTimeSlot[];
  selectedTime: string;
  onSelectSlot: (slot: PickupTimeSlot) => void;
}

export default function PickupTimeSlots({
  slots,
  selectedTime,
  onSelectSlot,
}: PickupTimeSlotsProps) {
  const availableSlotsCount = slots.filter((s) => s.isAvailable).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-white">
            Select Pickup Time Slot
          </label>
          <p className="text-[11px] text-[#A8A29A] mt-0.5">
            Slots generated at 15-minute intervals (08:00 AM – 11:00 PM IST)
          </p>
        </div>
        <span className="text-xs text-[#ABC438] font-semibold bg-[#232B0D] px-3 py-1 rounded-full shadow-xs">
          {availableSlotsCount} slots available
        </span>
      </div>

      {availableSlotsCount === 0 ? (
        <div className="p-6 rounded-xl bg-[#1C1A18] text-center space-y-2 shadow-xl">
          <Clock className="w-6 h-6 mx-auto text-[#7D776E]" />
          <p className="text-sm font-semibold text-white">
            No more pickup slots available for today
          </p>
          <p className="text-xs text-[#A8A29A]">
            Operating hours for today have closed or preparation lead time extends past closing. Please select tomorrow&apos;s date above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-2.5 max-h-80 overflow-y-auto pr-1">
          {slots.map((slot) => {
            const isSelected = selectedTime === slot.time24;
            const isAvailable = slot.isAvailable;

            return (
              <motion.button
                key={slot.time24}
                type="button"
                disabled={!isAvailable}
                whileHover={isAvailable ? { scale: 1.05 } : undefined}
                whileTap={isAvailable ? { scale: 0.95 } : undefined}
                onClick={() => onSelectSlot(slot)}
                className={`py-2 sm:py-2.5 px-1 sm:px-2 rounded-xl text-[11px] sm:text-xs font-semibold whitespace-nowrap text-center transition-colors cursor-pointer ${
                  !isAvailable
                    ? "opacity-30 bg-[#141210] text-[#7D776E] cursor-not-allowed line-through"
                    : isSelected
                    ? "bg-[#8DA419] text-[#121110] font-bold ring-2 ring-[#8DA419] shadow-lg shadow-[#8DA419]/30"
                    : "bg-[#1C1A18] text-[#E3DFD7] hover:bg-[#25221F]"
                }`}
              >
                {slot.timeDisplay}
              </motion.button>
            );
          })}
        </div>
      )}

      {/* Clear Pickup Instruction */}
      <div className="p-3.5 rounded-xl bg-[#1C1A18] flex items-start gap-2.5 text-xs text-[#C4BEB4] shadow-md">
        <Info className="w-4 h-4 text-[#8DA419] shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-semibold text-white">
            Arrival Window Commitment:
          </p>
          <p className="text-[#A8A29A]">
            Please arrive at the Pune outlet at or within 10 minutes of your selected pickup time. Drinks are freshly finished and temperature-controlled for your arrival.
          </p>
        </div>
      </div>
    </div>
  );
}
