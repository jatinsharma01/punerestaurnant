import { NextRequest, NextResponse } from "next/server";
import { verifyRazorpaySignature, RAZORPAY_KEY_SECRET } from "@/lib/razorpay";
import { getOrderById, updateOrderStatus, saveOrder } from "@/lib/orders-store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      orderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      isDemoPayment,
    } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required." },
        { status: 400 }
      );
    }

    const order = getOrderById(orderId);
    if (!order) {
      return NextResponse.json(
        { error: `Order ${orderId} not found.` },
        { status: 404 }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET || RAZORPAY_KEY_SECRET;
    let paymentVerified = false;

    if (isDemoPayment || order.payment.isDemoTransaction) {
      // Demo Payment Verification:
      // Allow testing without live Razorpay keys, but clearly preserve demo flags
      paymentVerified = true;
      order.payment = {
        ...order.payment,
        method: "mock_demo",
        razorpayPaymentId: razorpay_payment_id || `pay_demo_${Date.now()}`,
        status: "verified",
        verifiedAt: new Date().toISOString(),
        isDemoTransaction: true,
      };
    } else {
      // Production / Test Mode Signature Verification
      if (!keySecret) {
        return NextResponse.json(
          {
            error:
              "RAZORPAY_KEY_SECRET is not configured on the server.",
          },
          { status: 500 }
        );
      }

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return NextResponse.json(
          { error: "Missing required Razorpay payment signature parameters." },
          { status: 400 }
        );
      }

      paymentVerified = verifyRazorpaySignature(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        keySecret
      );

      if (!paymentVerified) {
        // Mark payment as failed
        updateOrderStatus(orderId, "payment_failed", "Signature verification failed.");
        return NextResponse.json(
          { error: "Payment verification failed. Invalid HMAC signature." },
          { status: 400 }
        );
      }

      order.payment = {
        ...order.payment,
        method: "razorpay",
        razorpayPaymentId: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id,
        razorpaySignature: razorpay_signature,
        status: "verified",
        verifiedAt: new Date().toISOString(),
      };
    }

    // Update order status to confirmed
    const nowIso = new Date().toISOString();
    order.status = "confirmed";
    order.timeline.push({
      status: "confirmed",
      label: "Payment Verified & Pickup Reserved",
      description: `Payment of ₹${order.total} received. Pickup reserved for ${order.booking.pickupTimeDisplay} on ${order.booking.pickupDate} at Pour Club Pune.`,
      timestamp: nowIso,
    });

    saveOrder(order);

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error: any) {
    console.error("Payment Verification Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to verify payment." },
      { status: 500 }
    );
  }
}
