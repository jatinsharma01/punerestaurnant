import { OutletInfo } from "@/types/booking";

export const BRAND_CONFIG = {
  name: "POUR CLUB",
  legalEntity: "Pour Club Beverages Private Limited (Demo)",
  tagline: "Your drink. Your time.",
  subTagline: "Good drinks, ready when you are.",
  currency: "INR",
  currencySymbol: "₹",
  defaultTaxRatePercent: 5, // 5% GST for food/beverages in India
  leadTimeMinutes: 12, // Baseline minimum prep lead time
  slotIntervalMinutes: 15, // Pickup slots every 15 minutes
  maxDaysInAdvance: 7, // Allow booking up to 7 days ahead
};

export const PRIMARY_PUNE_OUTLET: OutletInfo = {
  id: "pour-club-pune-primary",
  name: "Pour Club — Pune",
  brand: "POUR CLUB",
  tagline: "Your drink. Your time.",
  subTagline: "Good drinks, ready when you are.",
  city: "Pune",
  state: "Maharashtra",
  country: "India",
  addressPlaceholder: "Pune, Maharashtra (Detailed street address to be announced)",
  timezone: "Asia/Kolkata",
  currency: "INR",
  pickupMethod: "In-store pickup",
  operatingHours: {
    openTime: "08:00",
    closeTime: "23:00",
    daysOpen: "Everyday (Mon - Sun)",
    isDemoSchedule: true,
  },
  contact: {
    supportEmail: "orders@pourclub.in",
    note: "Customer support active during outlet operating hours.",
  },
  pickupInstructions: [
    "Head directly to the dedicated 'Pre-Booked Pickup' counter.",
    "Show your digital order code or confirm the name on your booking.",
    "Your drink is freshly finished and temperature-controlled for your requested pickup time.",
    "No queuing at the order register required.",
  ],
};

export const ALL_OUTLETS: OutletInfo[] = [PRIMARY_PUNE_OUTLET];
