import type { Metadata, Viewport } from "next";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { BookingProvider } from "@/context/BookingContext";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  variable: "--font-dm-serif",
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#121110",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: "POUR CLUB — Premium Drink Pre-Booking & Instant Pickup in Pune",
    template: "%s | POUR CLUB Pune",
  },
  description:
    "Order ahead. Skip the wait. Handcrafted espresso, cold brew, artisanal matcha, and chilled refreshers ready when you arrive in Pune, Maharashtra.",
  keywords: [
    "coffee pickup Pune",
    "drink pre-order Pune",
    "cold brew Pune",
    "matcha latte Pune",
    "Pour Club Pune",
    "instant pickup drinks",
  ],
  authors: [{ name: "Pour Club Pune" }],
  openGraph: {
    title: "POUR CLUB — Pune",
    description: "Your drink. Your time. Order ahead and pick up fresh in Pune.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmSerif.variable} dark`}>
      <body className="min-h-screen flex flex-col bg-[#121110] text-[#F5F3EF] font-sans antialiased selection:bg-[#8DA419] selection:text-white">
        <CartProvider>
          <BookingProvider>
            {children}
          </BookingProvider>
        </CartProvider>
      </body>
    </html>
  );
}
