import { NextRequest, NextResponse } from "next/server";
import { getOrderById, updateOrderStatus } from "@/lib/orders-store";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const order = getOrderById(orderId);

    if (!order) {
      return NextResponse.json(
        { error: `Order ${orderId} not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error: any) {
    console.error("Order Lookup Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch order." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const body = await req.json();
    const { status, description } = body;

    const updated = updateOrderStatus(orderId, status, description);
    if (!updated) {
      return NextResponse.json(
        { error: `Order ${orderId} not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to update order status." },
      { status: 500 }
    );
  }
}
