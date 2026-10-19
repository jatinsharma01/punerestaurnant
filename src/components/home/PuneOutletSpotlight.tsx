"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { PRIMARY_PUNE_OUTLET } from "@/config/outlet";
import { EDITORIAL_ASSETS } from "@/data/drinks";

export default function PuneOutletSpotlight() {
  return (
    <section id="outlet" className="py-20 bg-[#121110]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Images Layout: Two Editorial Photos with Hover Micro-Animations */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 grid grid-cols-2 gap-4"
          >
            <motion.div
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              className="group relative aspect-3/4 rounded-xl overflow-hidden bg-[#1E1B18] shadow-lg"
            >
              <Image
                src={EDITORIAL_ASSETS.cafeInterior.url}
                alt="Illustrative Pour Club café interior"
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </motion.div>
            <motion.div
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              className="group relative aspect-3/4 rounded-xl overflow-hidden bg-[#1E1B18] shadow-lg mt-8"
            >
              <Image
                src={EDITORIAL_ASSETS.baristaCraft.url}
                alt="Barista crafting beverage behind counter"
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </motion.div>
          </motion.div>

          {/* Outlet Details & Pre-Booking Protocol */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="space-y-2">
              <span className="text-xs font-semibold tracking-widest uppercase text-[#ABC438]">
                Our Location
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white">
                {PRIMARY_PUNE_OUTLET.name}
              </h2>
              <p className="text-sm text-[#C4BEB4] leading-relaxed">
                A dedicated beverage outpost designed for rapid, seamless collection. Whether you&apos;re heading to work, crossing through town, or wrapping up your evening, your drink is waiting.
              </p>
            </div>

            {/* Address & Hours Info Card */}
            <div className="bg-[#1E1B18] rounded-xl p-4 sm:p-6 space-y-4 shadow-xl">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#8DA419] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                    Address & Pickup Bay
                  </h4>
                  <p className="text-sm text-[#E3DFD7]">
                    {PRIMARY_PUNE_OUTLET.addressPlaceholder}
                  </p>
                  <p className="text-[11px] text-[#A8A29A]">
                    In-Store Pickup Only • Dedicated Pre-Booked Counter
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3">
                <Clock className="w-5 h-5 text-[#8DA419] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                    Operating Hours (Sample Schedule)
                  </h4>
                  <p className="text-sm text-[#E3DFD7]">
                    {PRIMARY_PUNE_OUTLET.operatingHours.daysOpen} • 08:00 AM – 11:00 PM IST
                  </p>
                  <p className="text-[11px] text-[#ABC438]">
                    *Time slots available every 15 minutes in Asia/Kolkata timezone
                  </p>
                </div>
              </div>
            </div>

            {/* In-Store Pickup Guide */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-semibold tracking-wider uppercase text-white">
                How Pre-Booked Pickup Works In-Store
              </h4>
              <ul className="space-y-2 text-xs text-[#E3DFD7]">
                {PRIMARY_PUNE_OUTLET.pickupInstructions.map((instruction, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#8DA419] shrink-0 mt-0.5" />
                    <span>{instruction}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="inline-block w-full sm:w-auto">
                <Link
                  href="/booking"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#8DA419] text-[#121110] hover:bg-[#A3BA20] transition-colors shadow-lg cursor-pointer font-bold"
                >
                  <span>Reserve Your Pickup Slot</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
