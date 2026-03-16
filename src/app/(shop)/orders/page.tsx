"use client";
import { useEffect } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { OrderCard }  from "@/components/order/OrderCard";
import { PageLoader } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { useOrders }  from "@/hooks/useOrders";
import { Package }    from "lucide-react";

export default function OrdersPage() {
  const { orders, isLoading, loadOrders } = useOrders();

  useEffect(() => { loadOrders(); }, []);

  return (
    <ProtectedRoute allowedRoles={["customer"]}>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">My Orders</h1>
        {isLoading ? <PageLoader /> : (
          <div className="space-y-4">
            {(orders as { orders: unknown[] } | null)?.orders?.length === 0 ? (
              <EmptyState icon={<Package className="h-12 w-12" />} title="No orders yet" message="Start shopping to see your orders here" />
            ) : (
              ((orders as { orders: unknown[] } | null)?.orders || []).map((order) => (
                <OrderCard key={(order as { _id: string })._id} order={order as import("@/types/order.types").Order} />
              ))
            )}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
