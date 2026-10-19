import React from "react";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import HeroSection from "@/components/home/HeroSection";
import QuickPicksSection from "@/components/home/QuickPicksSection";
import ScheduleAdvantage from "@/components/home/ScheduleAdvantage";
import CraftVideoBanner from "@/components/home/CraftVideoBanner";
import FeaturedCollection from "@/components/home/FeaturedCollection";
import PuneOutletSpotlight from "@/components/home/PuneOutletSpotlight";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#121110] text-[#F5F3EF]">
      <SiteHeader transparent />
      <main className="flex-1">
        <HeroSection />
        <QuickPicksSection />
        <ScheduleAdvantage />
        <FeaturedCollection />
        <CraftVideoBanner />
        <PuneOutletSpotlight />
      </main>
      <SiteFooter />
    </div>
  );
}
