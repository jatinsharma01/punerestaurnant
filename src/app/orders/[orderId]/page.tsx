import React, { Suspense } from "react";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import OrderStatusClient from "@/components/orders/OrderStatusClient";

interface PageProps {
  params: Promise<{ orderId: string }>;
}

async function OrderStatusWrapper({
  paramsPromise,
}: {
  paramsPromise: Promise<{ orderId: string }>;
}) {
  const { orderId } = await paramsPromise;
  return <OrderStatusClient orderId={orderId} />;
}

export default function OrderStatusPage({ params }: PageProps) {
  return (
    <div className="flex flex-col min-h-screen bg-[#121110] text-[#F5F3EF]">
      <SiteHeader />
      <main className="flex-1 py-10 sm:py-16">
        <Suspense
          fallback={
            <div className="max-w-2xl mx-auto py-20 text-center space-y-4">
              <div className="w-8 h-8 mx-auto rounded-full border-2 border-[#8DA419] border-t-transparent animate-spin" />
              <p className="text-xs text-[#A8A29A] uppercase tracking-wider">
                Loading order status...
              </p>
            </div>
          }
        >
          <OrderStatusWrapper paramsPromise={params} />
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  );
}
