"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getSelectableDates } from "@/lib/date-time";

interface PickupDatePickerProps {
  selectedDate: string;
  onSelectDate: (dateStr: string) => void;
}

export default function PickupDatePicker({
  selectedDate,
  onSelectDate,
}: PickupDatePickerProps) {
  const [dates, setDates] = useState<{ dateString: string; displayLabel: string }[]>([]);

  useEffect(() => {
    setDates(getSelectableDates(7));
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-white">
          Select Pickup Date
        </label>
        <span className="text-xs text-[#A8A29A]">Asia/Kolkata Business Calendar</span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {dates.map((d) => {
          const isSelected = selectedDate === d.dateString;
          return (
            <motion.button
              key={d.dateString}
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onSelectDate(d.dateString)}
              className={`px-4 py-3 rounded-xl text-center min-w-[120px] transition-colors cursor-pointer ${
                isSelected
                  ? "bg-[#8DA419] text-[#121110] font-bold shadow-lg shadow-[#8DA419]/30"
                  : "bg-[#1C1A18] text-[#C4BEB4] hover:bg-[#25221F] hover:text-white"
              }`}
            >
              <div className="text-xs font-semibold">{d.displayLabel}</div>
              <div
                className={`text-[10px] mt-0.5 ${
                  isSelected ? "text-[#121110] font-semibold" : "text-[#7D776E]"
                }`}
              >
                {d.dateString}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
