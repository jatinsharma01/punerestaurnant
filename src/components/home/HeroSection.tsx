"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Coffee } from "lucide-react";
import { EDITORIAL_ASSETS } from "@/data/drinks";
import CafeAmbientPlayer from "@/components/home/CafeAmbientPlayer";

export default function HeroSection() {
  return (
    <section className="relative min-h-[100svh] min-h-[100dvh] sm:min-h-screen w-full flex flex-col justify-center items-center pt-24 sm:pt-28 pb-10 sm:pb-16 overflow-hidden bg-[#121110]">
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

        {/* Base dark tint layer */}
        <div className="absolute inset-0 bg-black/50 backdrop-contrast-105" />

        {/* Sophisticated dark cinematic gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/45 to-black/85" />

        {/* Radial vignette for focus in the center */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(0,0,0,0.65)_100%)] pointer-events-none" />

        {/* Subtle bottom transition to section below */}
        <div className="absolute bottom-0 inset-x-0 h-24 sm:h-36 bg-gradient-to-t from-[#121110] via-[#121110]/70 to-transparent pointer-events-none" />
      </div>

      {/* 2. Cohesive, Grand Editorial Content Container */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center my-auto">
        {/* Grand Editorial Headline with increased text spacing */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="w-full"
        >
          <h1 className="font-serif text-[2.75rem] xs:text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-normal tracking-tight text-white leading-[1.15] sm:leading-[1.04] drop-shadow-2xl">
            <span>Your drink.</span>
            <span className="block mt-2 sm:mt-3 italic font-normal text-[#ABC438] drop-shadow-md">
              Your time.
            </span>
          </h1>

          {/* Descriptive text with generous spacing and airy readability */}
          <p className="mt-5 sm:mt-7 text-sm xs:text-base sm:text-xl text-[#F2EFE8]/90 max-w-xl sm:max-w-2xl mx-auto leading-relaxed sm:leading-loose drop-shadow-md font-normal px-2">
            Skip the counter queue. Pre-order single-origin coffees, slow cold brews, ceremonial matcha, and crushed fruit coolers—handcrafted and waiting the second you step into our Pune outlet.
          </p>
        </motion.div>

        {/* Dual CTA Button Group */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-md sm:max-w-none mx-auto"
        >
          {/* Primary CTA */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
            <Link
              href="/menu"
              className="w-full sm:w-auto group inline-flex items-center justify-center gap-2.5 sm:gap-3 px-7 sm:px-9 py-3.5 sm:py-4 rounded-full text-xs sm:text-sm font-bold tracking-wider uppercase bg-[#8DA419] text-[#181614] hover:bg-[#A3BA20] hover:text-[#181614] shadow-2xl shadow-[#8DA419]/40 transition-all duration-300 cursor-pointer"
            >
              <Coffee className="w-4 h-4 text-[#181614]" />
              <span>Explore the Menu</span>
              <ArrowRight className="w-4 h-4 text-[#181614] group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
          </motion.div>

          {/* Secondary CTA: Pre-book slot */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
            <Link
              href="/booking"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 sm:px-8 py-3.5 sm:py-4 rounded-full text-xs sm:text-sm font-semibold tracking-wider uppercase text-white bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all duration-300 cursor-pointer shadow-lg"
            >
              <Calendar className="w-4 h-4 text-[#ABC438]" />
              <span>Schedule Future Slot</span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Embedded Ambient Café Music Player - balanced spacing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 sm:mt-8 w-full"
        >
          <CafeAmbientPlayer />
        </motion.div>
      </div>
    </section>
  );
}
