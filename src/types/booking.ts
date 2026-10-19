export type PickupMode = "schedule" | "instant";

export interface OutletInfo {
  id: string;
  name: string;
  brand: string;
  tagline: string;
  subTagline: string;
  city: string;
  state: string;
  country: string;
  addressPlaceholder: string;
  timezone: string;
  currency: string;
  pickupMethod: "In-store pickup";
  operatingHours: {
    openTime: string; // "08:00"
    closeTime: string; // "23:00"
    daysOpen: string; // "Mon - Sun"
    isDemoSchedule: boolean;
  };
  contact: {
    supportEmail: string;
    note: string;
  };
  pickupInstructions: string[];
}

export interface PickupTimeSlot {
  time24: string; // "14:30"
  timeDisplay: string; // "02:30 PM"
  isAvailable: boolean;
  isEarliestEstimate?: boolean;
}

export interface BookingDetails {
  outletId: string;
  outletName: string;
  mode: PickupMode;
  pickupDate: string; // "YYYY-MM-DD"
  pickupTime: string; // "14:30"
  pickupTimeDisplay: string; // "02:30 PM"
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  specialInstructions?: string;
}
