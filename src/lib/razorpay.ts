import Razorpay from "razorpay";
import crypto from "crypto";

// Directly configured Razorpay credentials
export const RAZORPAY_KEY_ID = "rzp_test_TpUd02lkOOMpnU";
export const RAZORPAY_KEY_SECRET = "fnBW5Dnxyuhc5BQEJq19WukM";
export const APP_NODE_ENV = "development";

/**
 * Server-only Razorpay client helper.
 * Never import this file into Client Components.
 */

export function getRazorpayClient(): Razorpay | null {
  const keyId = process.env.RAZORPAY_KEY_ID || RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET || RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret || keyId === "rzp_test_placeholder") {
    return null;
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

/**
 * Verify Razorpay payment signature according to official specification:
 * HMAC SHA256 hash of `${razorpay_order_id}|${razorpay_payment_id}` using RAZORPAY_KEY_SECRET.
 */
export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string,
  secret: string = RAZORPAY_KEY_SECRET
): boolean {
  try {
    const text = `${orderId}|${paymentId}`;
    const generatedSignature = crypto
      .createHmac("sha256", secret || RAZORPAY_KEY_SECRET)
      .update(text)
      .digest("hex");
    return crypto.timingSafeEqual(
      Buffer.from(generatedSignature),
      Buffer.from(signature)
    );
  } catch {
    return false;
  }
}
