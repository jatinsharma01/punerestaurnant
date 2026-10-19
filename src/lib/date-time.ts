import { PRIMARY_PUNE_OUTLET, BRAND_CONFIG } from "@/config/outlet";
import { PickupTimeSlot } from "@/types/booking";

const TIMEZONE = PRIMARY_PUNE_OUTLET.timezone; // "Asia/Kolkata"

/**
 * Get current Date and Time in Asia/Kolkata timezone.
 */
export function getPuneCurrentDateTime(): Date {
  const now = new Date();
  // Get string in Asia/Kolkata timezone
  const kolkataTimeString = now.toLocaleString("en-US", { timeZone: TIMEZONE });
  return new Date(kolkataTimeString);
}

/**
 * Format a Date object to YYYY-MM-DD in Asia/Kolkata.
 */
export function formatPuneDate(date: Date): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(date); // e.g. "2026-10-19"
}

/**
 * Format date for user-friendly display (e.g., "Today, 19 Oct" or "Tue, 20 Oct")
 */
export function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return "";
  const parts = dateStr.split("-").map(Number);
  if (parts.length !== 3 || isNaN(parts[0]) || isNaN(parts[1]) || isNaN(parts[2])) {
    return dateStr;
  }
  const [y, m, d] = parts;
  const dateObj = new Date(y, m - 1, d);

  return new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(dateObj);
}

/**
 * Convert 24h string "14:30" to 12h display string "02:30 PM"
 */
export function format12HourTime(time24: string): string {
  const [hoursStr, minutesStr] = time24.split(":");
  let hours = parseInt(hoursStr, 10);
  const minutes = minutesStr;
  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const paddedHours = hours < 10 ? `0${hours}` : `${hours}`;
  return `${paddedHours}:${minutes} ${period}`;
}

/**
 * Generate selectable dates up to maxDaysInAdvance starting from today.
 */
export function getSelectableDates(maxDays = BRAND_CONFIG.maxDaysInAdvance): {
  dateString: string;
  displayLabel: string;
}[] {
  const dates = [];
  const puneNow = getPuneCurrentDateTime();

  for (let i = 0; i < maxDays; i++) {
    const d = new Date(puneNow);
    d.setDate(d.getDate() + i);
    const dateString = formatPuneDate(d);
    dates.push({
      dateString,
      displayLabel: formatDisplayDate(dateString),
    });
  }
  return dates;
}

/**
 * Check if the Pune outlet is currently open based on operating hours.
 */
export function isPuneOutletOpenNow(): {
  isOpen: boolean;
  statusText: string;
  nextOpenTime?: string;
} {
  const puneNow = getPuneCurrentDateTime();
  const currentMinutes = puneNow.getHours() * 60 + puneNow.getMinutes();

  const [openH, openM] = PRIMARY_PUNE_OUTLET.operatingHours.openTime.split(":").map(Number);
  const [closeH, closeM] = PRIMARY_PUNE_OUTLET.operatingHours.closeTime.split(":").map(Number);

  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;

  if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
    return {
      isOpen: true,
      statusText: `Open until ${format12HourTime(PRIMARY_PUNE_OUTLET.operatingHours.closeTime)}`,
    };
  }

  return {
    isOpen: false,
    statusText: `Closed now • Opens at ${format12HourTime(PRIMARY_PUNE_OUTLET.operatingHours.openTime)}`,
    nextOpenTime: PRIMARY_PUNE_OUTLET.operatingHours.openTime,
  };
}

/**
 * Calculate the earliest estimated pickup time in minutes from now.
 */
export function calculateEarliestPickupEstimate(additionalPrepMinutes = 0): {
  time24: string;
  timeDisplay: string;
  estimatedMinutesFromNow: number;
  isAvailableToday: boolean;
} {
  const puneNow = getPuneCurrentDateTime();
  const totalLeadMinutes = BRAND_CONFIG.leadTimeMinutes + additionalPrepMinutes;
  
  // Target arrival time
  const targetTime = new Date(puneNow.getTime() + totalLeadMinutes * 60 * 1000);
  
  // Round up to next 5 or 15 minute slot boundary
  const rem = targetTime.getMinutes() % 5;
  if (rem !== 0) {
    targetTime.setMinutes(targetTime.getMinutes() + (5 - rem));
  }
  targetTime.setSeconds(0);

  const hours = targetTime.getHours();
  const minutes = targetTime.getMinutes();
  const time24 = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

  const [closeH, closeM] = PRIMARY_PUNE_OUTLET.operatingHours.closeTime.split(":").map(Number);
  const targetTotalMinutes = hours * 60 + minutes;
  const closeMinutes = closeH * 60 + closeM;

  const isAvailableToday = targetTotalMinutes < closeMinutes;

  return {
    time24,
    timeDisplay: format12HourTime(time24),
    estimatedMinutesFromNow: totalLeadMinutes,
    isAvailableToday,
  };
}

/**
 * Generate pickup time slots for a given date in Pune.
 * Filters out past times if date is today, and respects operating hours.
 */
export function generateTimeSlots(
  selectedDate: string,
  estimatedPrepMinutes = 0
): PickupTimeSlot[] {
  const slots: PickupTimeSlot[] = [];
  const puneNow = getPuneCurrentDateTime();
  const todayStr = formatPuneDate(puneNow);
  const isToday = selectedDate === todayStr;

  const [openH, openM] = PRIMARY_PUNE_OUTLET.operatingHours.openTime.split(":").map(Number);
  const [closeH, closeM] = PRIMARY_PUNE_OUTLET.operatingHours.closeTime.split(":").map(Number);

  const openTotalMinutes = openH * 60 + openM;
  const closeTotalMinutes = closeH * 60 + closeM;

  // Minimum minute cutoff for today
  const currentMinutes = puneNow.getHours() * 60 + puneNow.getMinutes();
  const minAllowedMinutesToday = currentMinutes + BRAND_CONFIG.leadTimeMinutes + estimatedPrepMinutes;

  for (let m = openTotalMinutes; m < closeTotalMinutes; m += BRAND_CONFIG.slotIntervalMinutes) {
    const slotH = Math.floor(m / 60);
    const slotM = m % 60;
    const time24 = `${slotH.toString().padStart(2, "0")}:${slotM.toString().padStart(2, "0")}`;
    const timeDisplay = format12HourTime(time24);

    let isAvailable = true;
    if (isToday && m < minAllowedMinutesToday) {
      isAvailable = false;
    }

    slots.push({
      time24,
      timeDisplay,
      isAvailable,
    });
  }

  return slots;
}

export const calculateEarliestInstantEstimate = calculateEarliestPickupEstimate;
export const generate15MinPickupSlots = generateTimeSlots;
