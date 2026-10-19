import { CartItem } from "./cart";
import { BookingDetails } from "./booking";

export type OrderStatus =
  | "awaiting_payment"
  | "payment_processing"
  | "confirmed"
  | "preparing"
  | "ready_for_pickup"
  | "completed"
  | "cancelled"
  | "payment_failed";

export interface PaymentDetails {
  method: "razorpay" | "mock_demo";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  amountPaise: number;
  currency: string;
  status: "pending" | "verified" | "failed";
  verifiedAt?: string;
  isDemoTransaction?: boolean;
}

export interface OrderRecord {
  id: string; // e.g. "PC-PUN-84729"
  createdAt: string; // ISO
  booking: BookingDetails;
  customer?: {
    name: string;
    phone?: string;
    email?: string;
  };
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: OrderStatus;
  payment: PaymentDetails;
  timeline: {
    status: OrderStatus;
    label: string;
    description: string;
    timestamp: string;
  }[];
}
