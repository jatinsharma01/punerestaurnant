"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Zap, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function ScheduleAdvantage() {
  return (
    <section id="how-it-works" className="py-20 lg:py-24 bg-[#121110]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mx-auto text-center space-y-3 mb-16"
        >
          <span className="text-xs font-semibold tracking-widest uppercase text-[#ABC438]">
            Made for Your Schedule
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl tracking-tight text-white">
            Order ahead. Skip the wait.
          </h2>
          <p className="text-sm sm:text-base text-[#A8A29A]">
            Designed for urban Pune dwellers who value their time as much as their coffee. Choose how you want to pick up.
          </p>
        </motion.div>

        {/* Dual Ordering Modes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Mode 1: Schedule Ahead */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -6 }}
            className="group relative overflow-hidden bg-[#181614] rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl flex flex-col justify-between transition-shadow duration-500 hover:shadow-[#ABC438]/10"
          >
            {/* Background Image & Ambient Scrim */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              <Image
                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=85"
                alt="Schedule a Future Pickup in Pune"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center group-hover:scale-105 transition-all duration-700 ease-out opacity-30 group-hover:opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121110] via-[#121110]/85 to-[#121110]/70" />
            </div>

            {/* Card Content */}
            <div className="relative z-10 space-y-5">
              <div className="w-12 h-12 rounded-xl bg-[#282420]/80 backdrop-blur-md group-hover:bg-[#2B3512] flex items-center justify-center text-[#ABC438] transition-colors duration-300">
                <Calendar className="w-6 h-6 text-[#ABC438] group-hover:scale-110 transition-transform duration-300" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold tracking-wider uppercase text-[#ABC438]">
                    Mode 01
                  </span>
                  <span className="text-xs text-[#A8A29A]">• Recommended</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl text-white group-hover:text-[#ABC438] transition-colors">
                  Schedule a Future Pickup
                </h3>
                <p className="text-sm text-[#C4BEB4] leading-relaxed">
                  Heading to the outlet at 10:00 PM tonight or picking up before a morning meeting? Pre-book your slot up to 7 days ahead. Our baristas brew so your beverage hits peak flavour and temperature the moment you arrive.
                </p>
              </div>

              <ul className="space-y-2.5 text-xs text-[#E3DFD7] pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#8DA419] shrink-0" />
                  <span>Choose any 15-minute slot within outlet hours</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#8DA419] shrink-0" />
                  <span>Drink temperature locked until your arrival</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#8DA419] shrink-0" />
                  <span>Walk straight past the ordering queue to counter</span>
                </li>
              </ul>
            </div>

            <div className="relative z-10 pt-8">
              <Link
                href="/booking"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white hover:text-[#ABC438] group/link transition-colors"
              >
                <span>Select a future slot</span>
                <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1.5 transition-transform duration-300" />
              </Link>
            </div>
          </motion.div>

          {/* Mode 2: Instant Pickup */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.75, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -6 }}
            className="group relative overflow-hidden bg-[#181614] rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl flex flex-col justify-between transition-shadow duration-500 hover:shadow-[#ABC438]/10"
          >
            {/* Background Image & Ambient Scrim */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              <Image
                src="https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=1200&q=85"
                alt="Order Now Instant Pickup in Pune"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center group-hover:scale-105 transition-all duration-700 ease-out opacity-30 group-hover:opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121110] via-[#121110]/85 to-[#121110]/70" />
            </div>

            {/* Card Content */}
            <div className="relative z-10 space-y-5">
              <div className="w-12 h-12 rounded-xl bg-[#282420]/80 backdrop-blur-md group-hover:bg-[#2B3512] flex items-center justify-center text-[#ABC438] transition-colors duration-300">
                <Zap className="w-6 h-6 text-[#ABC438] group-hover:scale-110 transition-transform duration-300" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold tracking-wider uppercase text-[#ABC438]">
                    Mode 02
                  </span>
                  <span className="text-xs text-[#A8A29A]">• Fast & Direct</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl text-white group-hover:text-[#ABC438] transition-colors">
                  Order Now (Instant Pickup)
                </h3>
                <p className="text-sm text-[#C4BEB4] leading-relaxed">
                  Walking nearby or stuck at a red light in Pune traffic? Place your order now. You receive an immediate live preparation estimate (~12–15 minutes), and your drink is handed to you as soon as you step inside.
                </p>
              </div>

              <ul className="space-y-2.5 text-xs text-[#E3DFD7] pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#8DA419] shrink-0" />
                  <span>Real-time prep lead based on current items in bag</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#8DA419] shrink-0" />
                  <span>Immediate kitchen queue confirmation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#8DA419] shrink-0" />
                  <span>Zero in-store register waiting</span>
                </li>
              </ul>
            </div>

            <div className="relative z-10 pt-8">
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white hover:text-[#ABC438] group/link transition-colors"
              >
                <span>Browse menu & order now</span>
                <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1.5 transition-transform duration-300" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Reassurance banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 sm:mt-12 p-4 sm:p-5 rounded-2xl bg-[#1A1816] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#C4BEB4] transition-colors shadow-lg"
        >
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#8DA419] shrink-0" />
            <span>
              <strong className="text-white">Backend Slot Confirmation:</strong> Your pickup time is verified and confirmed upon successful Razorpay payment before kitchen slot reservation.
            </span>
          </div>
          <Link
            href="/menu"
            className="text-xs font-semibold text-[#ABC438] hover:text-white shrink-0 transition-colors"
          >
            Start your order &rarr;
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
