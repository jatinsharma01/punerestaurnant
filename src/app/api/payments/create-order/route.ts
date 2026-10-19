import { NextRequest, NextResponse } from "next/server";
import { getRazorpayClient, RAZORPAY_KEY_ID } from "@/lib/razorpay";
import { validateAndCalculateServerOrder } from "@/lib/pricing";
import { validateCustomerName, validateIndianMobileNumber, validateEmail } from "@/lib/validation";
import { saveOrder } from "@/lib/orders-store";
import { OrderRecord } from "@/types/order";
import { PRIMARY_PUNE_OUTLET } from "@/config/outlet";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, booking } = body;

    // 1. Validate customer details
    const nameVal = validateCustomerName(booking?.customerName || "");
    if (!nameVal.valid) {
      return NextResponse.json(
        { error: nameVal.error || "Invalid customer name" },
        { status: 400 }
      );
    }

    const phoneVal = validateIndianMobileNumber(booking?.customerPhone || "");
    if (!phoneVal.valid) {
      return NextResponse.json(
        { error: phoneVal.error || "Invalid mobile number" },
        { status: 400 }
      );
    }

    if (booking?.customerEmail && !validateEmail(booking.customerEmail)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // 2. Validate booking slot and outlet
    if (!booking?.pickupDate || !booking?.pickupTime) {
      return NextResponse.json(
        { error: "Please select a valid pickup date and time." },
        { status: 400 }
      );
    }

    if (booking?.outletId !== PRIMARY_PUNE_OUTLET.id) {
      return NextResponse.json(
        { error: "Invalid outlet selected." },
        { status: 400 }
      );
    }

    // 3. Authoritative server calculation of order items & pricing
    const calc = validateAndCalculateServerOrder(
      items.map((it: any) => ({
        drinkId: it.drink?.id || it.drinkId,
        sizeId: it.size?.id || it.sizeId,
        sugarLevel: it.sugarLevel,
        iceLevel: it.iceLevel,
        customizationIds: it.customizations?.map((c: any) => ({
          groupId: c.groupId,
          optionId: c.option?.id || c.optionId,
        })),
        quantity: it.quantity,
      }))
    );

    if (!calc.valid) {
      return NextResponse.json({ error: calc.error }, { status: 400 });
    }

    // Generate internal Pour Club order ID
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderId = `PC-PUN-${randomSuffix}`;

    // 4. Razorpay order creation
    const razorpay = getRazorpayClient();
    let razorpayOrderId = "";
    let isDemoMode = false;

    if (razorpay) {
      // Real Razorpay Test Mode Order Creation
      const rzpOrder = await razorpay.orders.create({
        amount: calc.amountInPaise,
        currency: "INR",
        receipt: orderId,
        notes: {
          outlet: PRIMARY_PUNE_OUTLET.name,
          pickupTime: `${booking.pickupDate} ${booking.pickupTime}`,
          customerPhone: phoneVal.sanitized,
        },
      });
      razorpayOrderId = rzpOrder.id;
    } else {
      // Demo Mode Fallback when API keys not yet configured in .env.local
      isDemoMode = true;
      razorpayOrderId = `order_demo_${Date.now()}`;
    }

    // 5. Store pending order in order store
    const nowIso = new Date().toISOString();
    const orderRecord: OrderRecord = {
      id: orderId,
      createdAt: nowIso,
      booking: {
        ...booking,
        customerPhone: phoneVal.sanitized,
      },
      items: calc.verifiedItems,
      subtotal: calc.subtotal,
      tax: calc.tax,
      total: calc.total,
      status: "awaiting_payment",
      payment: {
        method: isDemoMode ? "mock_demo" : "razorpay",
        razorpayOrderId,
        amountPaise: calc.amountInPaise,
        currency: "INR",
        status: "pending",
        isDemoTransaction: isDemoMode,
      },
      timeline: [
        {
          status: "awaiting_payment",
          label: "Order Created",
          description: "Awaiting customer payment verification via Razorpay.",
          timestamp: nowIso,
        },
      ],
    };

    saveOrder(orderRecord);

    return NextResponse.json({
      success: true,
      orderId,
      razorpayOrderId,
      amountPaise: calc.amountInPaise,
      currency: "INR",
      keyId: process.env.RAZORPAY_KEY_ID || RAZORPAY_KEY_ID,
      isDemoMode,
      outletName: PRIMARY_PUNE_OUTLET.name,
      pickupDate: booking.pickupDate,
      pickupTimeDisplay: booking.pickupTimeDisplay,
    });
  } catch (error: any) {
    console.error("Payment Order Creation Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create payment order." },
      { status: 500 }
    );
  }
}
