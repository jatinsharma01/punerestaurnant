import React from "react";
import Link from "next/link";
import { PRIMARY_PUNE_OUTLET, BRAND_CONFIG } from "@/config/outlet";
import { MapPin, Clock, ArrowUpRight } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="bg-[#121110] text-[#F7F3EB] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand & Manifesto */}
          <div className="md:col-span-5 space-y-4">
            <div className="space-y-1">
              <span className="font-serif text-3xl tracking-tight text-[#FCFAF7]">
                {BRAND_CONFIG.name}
              </span>
              <p className="text-xs uppercase tracking-[0.2em] text-[#ABC438] font-semibold">
                Pune, Maharashtra, India
              </p>
            </div>
            <p className="text-sm text-[#A8A196] leading-relaxed max-w-sm">
              &ldquo;{BRAND_CONFIG.tagline}&rdquo; Handcrafted single-origin coffees, slow cold brews, ceremonial Uji matcha, and fresh artisan coolers. Order ahead, skip the queue, and collect fresh upon arrival.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 text-xs font-medium text-[#ABC438] bg-[#29180F] px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8DA419]" />
                In-Store Pickup Only • No Delivery
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-semibold tracking-wider uppercase text-[#DCD5C6]">
              Catalogue & Ordering
            </h4>
            <ul className="space-y-2.5 text-sm text-[#A8A196]">
              <li>
                <Link
                  href="/menu"
                  className="hover:text-white flex items-center gap-1 transition-colors"
                >
                  Full Drink Menu
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#ABC438]" />
                </Link>
              </li>
              <li>
                <Link
                  href="/booking"
                  className="hover:text-white flex items-center gap-1 transition-colors"
                >
                  Schedule a Pickup Slot
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#ABC438]" />
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="hover:text-white transition-colors"
                >
                  Your Cart
                </Link>
              </li>
              <li>
                <Link
                  href="/#how-it-works"
                  className="hover:text-white transition-colors"
                >
                  How Pre-Booking Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Outlet Details & Operating Notice */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs font-semibold tracking-wider uppercase text-[#DCD5C6]">
              Pune Outlet Information
            </h4>
            <div className="space-y-3 text-sm text-[#A8A196]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#ABC438] shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">{PRIMARY_PUNE_OUTLET.name}</p>
                  <p className="text-xs text-[#8C857B]">
                    {PRIMARY_PUNE_OUTLET.addressPlaceholder}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#ABC438] shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Sample Operating Hours</p>
                  <p className="text-xs text-[#8C857B]">
                    {PRIMARY_PUNE_OUTLET.operatingHours.daysOpen}: 08:00 AM – 11:00 PM IST
                  </p>
                  <p className="text-[11px] text-[#ABC438]/80 mt-0.5">
                    *Configurable mock schedule for initial prototype
                  </p>
                </div>
              </div>

              <div className="pt-2 text-xs text-[#8C857B]">
                Payment processing powered by Razorpay (Test Mode).
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8C857B]">
          <p>© 2026 {BRAND_CONFIG.name} Pune. All rights reserved.</p>
          <p className="text-[11px]">
            Editorial beverage photography via Unsplash. Curated for Pour Club prototype.
          </p>
        </div>
      </div>
    </footer>
  );
}
