"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { DRINKS_DATA } from "@/data/drinks";
import DrinkCard from "@/components/menu/DrinkCard";

export default function FeaturedCollection() {
  // Feature a curated editorial selection of 6 representative drinks across categories
  const featuredSlugs = [
    "classic-iced-latte",
    "spanish-latte",
    "cold-brew",
    "matcha-latte",
    "watermelon-cooler",
    "chocolate-milkshake",
  ];

  const featuredDrinks = DRINKS_DATA.filter((d) =>
    featuredSlugs.includes(d.slug)
  );

  return (
    <section className="py-20 lg:py-24 bg-[#121110]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div className="space-y-2">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#ABC438]">
              Handcrafted Catalogue
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white">
              Signature Pune Creations
            </h2>
            <p className="text-sm text-[#A8A29A] max-w-xl">
              Freshly pulled double shots, single-origin cold extractions, and natural botanical infusions designed for immediate pickup.
            </p>
          </div>

          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white hover:text-[#ABC438] group transition-colors"
          >
            <span>View All 12+ Beverages</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
          </Link>
        </motion.div>

        {/* Product Cards Grid with stagger */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.08,
              },
            },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {featuredDrinks.map((drink) => (
            <motion.div
              key={drink.id}
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                },
              }}
            >
              <DrinkCard drink={drink} />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA to view menu */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-14 text-center"
        >
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="inline-block w-full sm:w-auto">
            <Link
              href="/menu"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:px-8 sm:py-4 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#1C1A18] text-white hover:bg-[#25221F] transition-colors shadow-xl cursor-pointer"
            >
              <span>Explore Full Menu & Customize Drinks</span>
              <ArrowRight className="w-4 h-4 text-[#ABC438] group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
