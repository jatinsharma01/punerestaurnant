import { OrderRecord, OrderStatus } from "@/types/order";
import fs from "fs";
import path from "path";

/**
 * In-Memory & File-Cached Order Store Adapter.
 * Automatically persists to .orders-cache.json to survive Next.js dev server worker restarts.
 */

const CACHE_FILE = path.join(process.cwd(), ".orders-cache.json");

// Use globalThis to persist store across Next.js dev server hot reloads
const globalForOrders = globalThis as unknown as {
  pourClubOrderStore: Map<string, OrderRecord>;
  hasLoadedDiskCache?: boolean;
};

export const orderStore: Map<string, OrderRecord> =
  globalForOrders.pourClubOrderStore || new Map<string, OrderRecord>();

if (process.env.NODE_ENV !== "production") {
  globalForOrders.pourClubOrderStore = orderStore;
}

function loadDiskCache() {
  if (globalForOrders.hasLoadedDiskCache) return;
  globalForOrders.hasLoadedDiskCache = true;
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const raw = fs.readFileSync(CACHE_FILE, "utf-8");
      const obj = JSON.parse(raw);
      for (const [k, v] of Object.entries(obj)) {
        if (!orderStore.has(k)) {
          orderStore.set(k, v as OrderRecord);
        }
      }
    }
  } catch (e) {
    console.warn("Could not read orders cache:", e);
  }
}

function saveDiskCache() {
  try {
    const obj: Record<string, OrderRecord> = {};
    for (const [k, v] of orderStore.entries()) {
      obj[k] = v;
    }
    fs.writeFileSync(CACHE_FILE, JSON.stringify(obj, null, 2), "utf-8");
  } catch (e) {
    console.warn("Could not save orders cache:", e);
  }
}

// Initial load
loadDiskCache();

export function saveOrder(order: OrderRecord): OrderRecord {
  loadDiskCache();
  orderStore.set(order.id, order);
  saveDiskCache();
  return order;
}

export type StoredOrder = OrderRecord;

export function getOrderById(orderId: string): OrderRecord | null {
  loadDiskCache();
  return orderStore.get(orderId) || null;
}

export const getStoredOrder = getOrderById;

export function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  description?: string
): OrderRecord | null {
  loadDiskCache();
  const existing = orderStore.get(orderId);
  if (!existing) return null;

  const nowIso = new Date().toISOString();
  const statusLabels: Record<OrderStatus, string> = {
    awaiting_payment: "Awaiting Payment",
    payment_processing: "Payment Processing",
    confirmed: "Order & Pickup Slot Confirmed",
    preparing: "Barista Preparing Drink",
    ready_for_pickup: "Ready at Pickup Counter",
    completed: "Order Collected",
    cancelled: "Order Cancelled",
    payment_failed: "Payment Failed",
  };

  const updated: OrderRecord = {
    ...existing,
    status: newStatus,
    timeline: [
      ...existing.timeline,
      {
        status: newStatus,
        label: statusLabels[newStatus],
        description: description || `Status updated to ${statusLabels[newStatus]}.`,
        timestamp: nowIso,
      },
    ],
  };

  orderStore.set(orderId, updated);
  saveDiskCache();
  return updated;
}
