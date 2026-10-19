import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import DrinkDetailCustomizer from "@/components/menu/DrinkDetailCustomizer";
import { DRINKS_DATA } from "@/data/drinks";
import { BRAND_CONFIG } from "@/config/outlet";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return DRINKS_DATA.map((drink) => ({
    slug: drink.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const drink = DRINKS_DATA.find((d) => d.slug === slug);

  if (!drink) {
    return {
      title: "Drink Not Found",
    };
  }

  return {
    title: `${drink.name} — Pre-Order in Pune`,
    description: `${drink.description} Pre-order at Pour Club Pune for ready-on-arrival pickup.`,
    openGraph: {
      title: `${drink.name} | ${BRAND_CONFIG.name} Pune`,
      description: drink.tagline,
      images: [{ url: drink.image, alt: drink.alt }],
    },
  };
}

export default async function DrinkDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const drink = DRINKS_DATA.find((d) => d.slug === slug);

  if (!drink) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#121110] text-[#F5F3EF]">
      <SiteHeader />
      <main className="flex-1">
        <DrinkDetailCustomizer drink={drink} />
      </main>
      <SiteFooter />
    </div>
  );
}
