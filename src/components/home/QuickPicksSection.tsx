"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Coffee, ShieldCheck, Sparkles, Flame } from "lucide-react";
import { DRINKS_DATA } from "@/data/drinks";
import { isPuneOutletOpenNow } from "@/lib/date-time";
import { formatINR } from "@/lib/currency";

export default function QuickPicksSection() {
  const [outletStatus, setOutletStatus] = useState({
    isOpen: true,
    statusText: "Open 08:00 AM – 11:00 PM IST",
  });

  useEffect(() => {
    setOutletStatus(isPuneOutletOpenNow());
  }, []);

  const featuredQuickPicks = DRINKS_DATA.filter((d) => d.popular || d.signature).slice(0, 5);

  return (
    <section className="relative z-10 w-full bg-[#121110] border-t border-white/[0.06] pt-10 sm:pt-14 pb-12 sm:pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 space-y-10 sm:space-y-12">
        {/* Real-time Status Badges & Quick Outlet Telemetry */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-white/[0.06] pb-8">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs">
            <div className="flex items-center gap-2 bg-white/[0.05] border border-white/10 px-4 py-2 rounded-full shadow-md">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8DA419] shrink-0 animate-pulse" />
              <span className="font-medium text-white">
                Ready in ~12 mins for instant orders
              </span>
            </div>

            <div className="flex items-center gap-2 bg-white/[0.05] border border-white/10 px-4 py-2 rounded-full text-white/90 shadow-md">
              <Clock className="w-4 h-4 text-[#ABC438]" />
              <span>{outletStatus.statusText}</span>
            </div>
          </div>

          <p className="text-xs text-[#A8A29A] text-center md:text-right">
            Live kitchen & counter status in FC Road, Pune
          </p>
        </div>

        {/* 4 Feature Telemetry Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white/80">
            <Clock className="w-4 h-4 text-[#ABC438] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-white">Zero Queue Wait</p>
              <p className="text-[11px] text-[#A8A29A] mt-0.5">Bypass register straight to Bay 1 & 2</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white/80">
            <ShieldCheck className="w-4 h-4 text-[#ABC438] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-white">Temp-Locked Cup</p>
              <p className="text-[11px] text-[#A8A29A] mt-0.5">Thermal holding bays preserve peak taste</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white/80">
            <Coffee className="w-4 h-4 text-[#ABC438] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-white">100% Single-Estate</p>
              <p className="text-[11px] text-[#A8A29A] mt-0.5">Indian specialty Arabica roasted locally</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white/80">
            <Sparkles className="w-4 h-4 text-[#ABC438] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-white">Instant UPI / Razorpay</p>
              <p className="text-[11px] text-[#A8A29A] mt-0.5">Automated queue & kitchen slot ticketing</p>
            </div>
          </div>
        </div>

        {/* Signature Pune Bestsellers Barista Strip */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1 text-left">
            <span className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-white/80">
              <Flame className="w-4 h-4 text-[#ABC438]" />
              <span className="hidden xs:inline">Signature Pune Bestsellers — Handcrafted Now</span>
              <span className="xs:hidden">Pune Bestsellers</span>
            </span>
            <Link
              href="/menu"
              className="text-xs font-semibold text-[#ABC438] hover:text-white transition-colors flex items-center gap-1 shrink-0"
            >
              <span>View All 12</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Horizontal responsive row of drink cards */}
          <div className="flex overflow-x-auto no-scrollbar gap-3 pb-2 sm:grid sm:grid-cols-3 lg:grid-cols-5 sm:gap-4 sm:pb-0 touch-pan-x text-left">
            {featuredQuickPicks.map((drink, idx) => (
              <motion.div
                key={drink.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="shrink-0 w-[240px] sm:w-auto"
              >
                <Link
                  href={`/menu/${drink.slug}`}
                  className="group relative flex flex-col justify-between p-3 sm:p-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] hover:border-[#ABC438]/30 transition-all duration-300 shadow-lg h-full"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden shrink-0 bg-black/40">
                      <Image
                        src={drink.image}
                        alt={drink.name}
                        fill
                        sizes="80px"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs sm:text-sm font-semibold text-white truncate group-hover:text-[#ABC438] transition-colors">
                        {drink.name}
                      </h4>
                      <span className="text-[11px] font-bold text-[#ABC438] block mt-0.5">
                        {formatINR(drink.basePrice)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-white/[0.05] flex items-center justify-between text-[10px] text-white/70">
                    <span className="truncate">{drink.category}</span>
                    <span className="font-semibold text-white group-hover:text-[#ABC438] shrink-0 flex items-center gap-1">
                      Order &rarr;
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
