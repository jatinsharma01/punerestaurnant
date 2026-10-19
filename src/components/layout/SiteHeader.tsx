"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu as MenuIcon, X, MapPin, Clock } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { PRIMARY_PUNE_OUTLET } from "@/config/outlet";
import { isPuneOutletOpenNow } from "@/lib/date-time";
import CartDrawer from "@/components/cart/CartDrawer";

const navLinks = [
  { href: "/menu", label: "Menu" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#outlet", label: "Our Outlet" },
];

function DesktopNav() {
  const pathname = usePathname();
  return (
    <nav className="hidden md:flex items-center gap-8">
      {navLinks.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm font-medium tracking-wide transition-colors ${
              isActive
                ? "text-[#ABC438] font-semibold"
                : "text-white/70 hover:text-white"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

interface SiteHeaderProps {
  transparent?: boolean;
}

export default function SiteHeader({ transparent = false }: SiteHeaderProps) {
  const { summary, isLoaded, openCartDrawer } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [outletStatus, setOutletStatus] = useState({
    isOpen: true,
    statusText: "Open 08:00 AM – 11:00 PM IST",
  });

  useEffect(() => {
    setOutletStatus(isPuneOutletOpenNow());
  }, []);

  const totalItems = isLoaded ? summary.totalQuantity : 0;

  return (
    <>
      {/* Top Operating Banner: Only rendered when NOT transparent to keep transparent header clean at the very top */}
      {!transparent && (
        <div className="bg-[#141210] text-[#F7F3EB] text-xs py-2 px-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[#8DA419] animate-pulse" />
              <span className="font-medium tracking-wider uppercase text-[11px] text-[#ABC438]">
                {PRIMARY_PUNE_OUTLET.name}
              </span>
              <span className="text-[#8C857B] hidden md:inline">•</span>
              <span className="text-[#DCD5C6] hidden md:inline">
                In-Store Pickup Only (Asia/Kolkata)
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-[#DCD5C6]">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#ABC438]" />
                {outletStatus.statusText}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Header */}
      <header
        className={`w-full transition-all ${
          transparent
            ? "absolute top-0 inset-x-0 z-40 bg-gradient-to-b from-black/60 via-black/25 to-transparent text-white"
            : "sticky top-0 z-40 bg-[#121110]/95 backdrop-blur-md text-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 sm:h-22 flex items-center justify-between">
          {/* Brand Wordmark */}
          <Link
            href="/"
            className="group flex flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8DA419] rounded"
          >
            <span className="font-serif text-2xl sm:text-3xl tracking-tight text-white group-hover:text-[#ABC438] transition-colors drop-shadow-sm">
              POUR CLUB
            </span>
            <span className="text-[10px] tracking-[0.25em] uppercase font-medium -mt-1 text-[#ABC438]">
              Pune • Maharashtra
            </span>
          </Link>

          {/* Desktop Navigation wrapped in Suspense */}
          <Suspense
            fallback={
              <nav className="hidden md:flex items-center gap-8">
                {navLinks.map((link) => (
                  <span
                    key={link.href}
                    className="text-sm font-medium text-white/80"
                  >
                    {link.label}
                  </span>
                ))}
              </nav>
            }
          >
            <DesktopNav />
          </Suspense>

          {/* Header Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* Cart Trigger */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openCartDrawer}
              aria-label={`View shopping bag with ${totalItems} items`}
              className="relative p-2.5 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8DA419] cursor-pointer text-white hover:bg-white/15 backdrop-blur-xs"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 drop-shadow-sm" />
              {totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 450, damping: 18 }}
                  className="absolute -top-1 -right-1 bg-[#8DA419] text-[#121110] text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md"
                >
                  {totalItems}
                </motion.span>
              )}
            </motion.button>

            {/* Order a Drink CTA button */}
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="hidden sm:inline-block">
              <Link
                href="/menu"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#8DA419] text-[#181614] hover:bg-[#A3BA20] hover:text-[#181614] shadow-md transition-colors cursor-pointer"
              >
                Order a Drink
              </Link>
            </motion.div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="md:hidden p-2 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8DA419] text-white hover:bg-white/10"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu with Framer Motion AnimatePresence */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="md:hidden overflow-hidden bg-[#181614]/98 backdrop-blur-xl px-4 pt-4 pb-6 space-y-4 shadow-2xl text-white"
            >
              <div className="flex flex-col space-y-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-base font-medium text-[#FCFAF7] hover:text-[#8DA419] py-2"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/booking"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-medium text-[#FCFAF7] hover:text-[#8DA419] py-2"
                >
                  Schedule a Pickup
                </Link>
              </div>

              <div className="pt-2">
                <Link
                  href="/menu"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center py-3 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#8DA419] text-[#181614] hover:bg-[#A3BA20]"
                >
                  Order a Drink Now
                </Link>
              </div>

              <div className="pt-2 text-xs text-[#A8A196] space-y-1">
                <p className="flex items-center gap-1.5 font-medium text-white">
                  <MapPin className="w-3.5 h-3.5 text-[#8DA419]" />
                  Pune, Maharashtra (In-Store Pickup Only)
                </p>
                <p className="text-[11px] text-[#A8A196]">
                  Sample operating hours: 08:00 AM – 11:00 PM IST
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Slide-out Cart Drawer */}
      <CartDrawer />
    </>
  );
}
