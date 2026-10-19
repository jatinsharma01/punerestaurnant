"use client";

import React, { useState, useEffect } from "react";
import { PRIMARY_PUNE_OUTLET } from "@/config/outlet";
import { MapPin, Clock, Store } from "lucide-react";
import { isPuneOutletOpenNow } from "@/lib/date-time";

export default function OutletSelector() {
  const [status, setStatus] = useState({
    isOpen: true,
    statusText: "Open 08:00 AM – 11:00 PM IST",
  });

  useEffect(() => {
    setStatus(isPuneOutletOpenNow());
  }, []);

  return (
    <div className="bg-[#1C1A18] rounded-2xl p-6 sm:p-7 space-y-4 shadow-xl">
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white">
          <Store className="w-4 h-4 text-[#8DA419]" />
          <span>Selected Outlet</span>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#ABC438] bg-[#232B0D] px-2.5 py-0.5 rounded">
          Only Available Outlet
        </span>
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="font-serif text-xl text-white">
            {PRIMARY_PUNE_OUTLET.name}
          </h3>
          <p className="text-xs text-[#A8A29A] flex items-center gap-1.5 mt-1">
            <MapPin className="w-3.5 h-3.5 text-[#8DA419] shrink-0" />
            {PRIMARY_PUNE_OUTLET.addressPlaceholder}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-[#A8A29A] pt-1">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#8DA419]" />
            {status.statusText}
          </span>
          <span className="text-[#7D776E]">•</span>
          <span>Timezone: Asia/Kolkata (IST)</span>
          <span className="text-[#7D776E]">•</span>
          <span className="font-medium text-[#ABC438]">In-Store Pickup Only</span>
        </div>
      </div>
    </div>
  );
}
