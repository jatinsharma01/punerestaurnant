"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Calendar, Sparkles, Coffee, ShieldCheck, Flame } from "lucide-react";
import { EDITORIAL_ASSETS, DRINKS_DATA } from "@/data/drinks";
import { isPuneOutletOpenNow } from "@/lib/date-time";
import { formatINR } from "@/lib/currency";
import CafeAmbientPlayer from "@/components/home/CafeAmbientPlayer";

export default function HeroSection() {
  const [outletStatus, setOutletStatus] = useState({
    isOpen: true,
    statusText: "Open 08:00 AM – 11:00 PM IST",
  });

  useEffect(() => {
    setOutletStatus(isPuneOutletOpenNow());
  }, []);

  // Quick-pick featured drinks for the creative interactive strip
  const featuredQuickPicks = DRINKS_DATA.filter((d) => d.popular || d.signature).slice(0, 5);

  return (
    <section className="relative min-h-[92vh] w-full flex flex-col justify-between pt-28 sm:pt-36 pb-16 overflow-hidden bg-[#121110]">
      {/* 1. Coffee Bar Interior Background Image with Darkened, Rich Moody Scrim */}
      <div className="absolute inset-0 z-0">
        <Image
          src={EDITORIAL_ASSETS.coffeeBarInterior.url}
          alt={EDITORIAL_ASSETS.coffeeBarInterior.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-105 transition-transform duration-1000 ease-out opacity-95"
        />

        {/* Base dark tint layer (slightly softened for subtle cafe visibility) */}
        <div className="absolute inset-0 bg-black/45 backdrop-contrast-105" />

        {/* Sophisticated dark cinematic gradient: darker at top/bottom for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/48 to-[#121110]" />

        {/* Radial vignette for focus in the center */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(0,0,0,0.78)_100%)] pointer-events-none" />

        {/* Bottom smooth transition to section below */}
        <div className="absolute bottom-0 inset-x-0 h-36 bg-gradient-to-t from-[#121110] via-[#121110]/80 to-transparent pointer-events-none" />
      </div>

      {/* 2. Full-Width Main Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 flex-1 flex flex-col justify-center text-center space-y-8 sm:space-y-10 my-auto">
        {/* Grand Full-Width Editorial Heading */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4 sm:space-y-6 max-w-5xl mx-auto"
        >
          <h1 className="font-serif text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-normal tracking-tight text-white leading-[1.04] sm:leading-[1.02] drop-shadow-2xl">
            Your drink. <br />
            <span className="italic font-normal text-[#ABC438] drop-shadow-md">
              Your time.
            </span>
          </h1>

          <p className="text-sm sm:text-lg lg:text-2xl text-[#F2EFE8] max-w-3xl mx-auto leading-relaxed drop-shadow-md font-normal text-white/90 px-1">
            Skip the counter queue. Pre-order single-origin coffees, slow cold brews, ceremonial matcha, and crushed fruit coolers—handcrafted and waiting the second you step into our Pune outlet.
          </p>
        </motion.div>

        {/* Dual CTA Button Group */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 w-full max-w-md sm:max-w-none mx-auto"
        >
          {/* Primary CTA */}
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
            <Link
              href="/menu"
              className="w-full sm:w-auto group inline-flex items-center justify-center gap-3 px-8 sm:px-9 py-3.5 sm:py-4 rounded-full text-xs sm:text-sm font-bold tracking-wider uppercase bg-[#8DA419] text-[#181614] hover:bg-[#A3BA20] hover:text-[#181614] shadow-2xl shadow-[#8DA419]/40 transition-all duration-300 cursor-pointer"
            >
              <Coffee className="w-4 h-4 text-[#181614]" />
              <span>Explore the Menu</span>
              <ArrowRight className="w-4 h-4 text-[#181614] group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
          </motion.div>

          {/* Secondary CTA: Pre-book slot */}
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
            <Link
              href="/booking"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 sm:px-8 py-3.5 sm:py-4 rounded-full text-xs sm:text-sm font-semibold tracking-wider uppercase text-white bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all duration-300 cursor-pointer shadow-lg"
            >
              <Calendar className="w-4 h-4 text-[#ABC438]" />
              <span>Schedule Future Slot</span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Creative Feature 1: Embedded Ambient Café Music Player */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="pt-3 sm:pt-6 w-full"
        >
          <CafeAmbientPlayer />
        </motion.div>

        {/* Creative Feature 2: Full-Width Quick-Pick Signature Barista Strip */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="pt-5 sm:pt-8 w-full"
        >
          <div className="flex items-center justify-between mb-3 px-1 text-left">
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
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + idx * 0.07 }}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="shrink-0 w-[240px] sm:w-auto"
              >
                <Link
                  href={`/menu/${drink.slug}`}
                  className="group relative flex flex-col justify-between p-3 sm:p-3.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] backdrop-blur-md transition-all duration-300 shadow-lg h-full"
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

                  <div className="mt-2.5 pt-2 flex items-center justify-between text-[10px] text-white/70">
                    <span className="truncate">{drink.category}</span>
                    <span className="font-semibold text-white group-hover:text-[#ABC438] shrink-0">
                      Order &rarr;
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Real-time Status Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-white/90 pt-2"
        >
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full shadow-md">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8DA419] shrink-0 animate-pulse" />
            <span className="font-medium text-white">
              Ready in ~12 mins for instant orders
            </span>
          </div>

          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full text-white/90 shadow-md">
            <Clock className="w-4 h-4 text-[#ABC438]" />
            <span>{outletStatus.statusText}</span>
          </div>
        </motion.div>
      </div>

      {/* 3. Full-Width Bottom Telemetry Bar */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 mt-10 pt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
          <div className="flex items-start gap-2.5 text-white/80">
            <Clock className="w-4 h-4 text-[#ABC438] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-white">Zero Queue Wait</p>
              <p className="text-[11px] text-white/60">Bypass register straight to Bay 1 & 2</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 text-white/80">
            <ShieldCheck className="w-4 h-4 text-[#ABC438] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-white">Temp-Locked Cup</p>
              <p className="text-[11px] text-white/60">Thermal holding bays preserve peak taste</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 text-white/80">
            <Coffee className="w-4 h-4 text-[#ABC438] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-white">100% Single-Estate</p>
              <p className="text-[11px] text-white/60">Indian specialty Arabica roasted locally</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 text-white/80">
            <Sparkles className="w-4 h-4 text-[#ABC438] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-white">Instant UPI / Razorpay</p>
              <p className="text-[11px] text-white/60">Automated queue & kitchen slot ticketing</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
