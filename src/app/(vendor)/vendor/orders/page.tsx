"use client";
import { useEffect, useState } from "react";
import { ProtectedRoute }    from "@/components/auth/ProtectedRoute";
import { DashboardSidebar }  from "@/components/layout/DashboardSidebar";
import { Button }     from "@/components/ui/Button";
import { PageLoader } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast }   from "@/hooks/useToast";
import { getVendorOrdersService } from "@/services/orderService";
import { orderService }   from "@/services/orderService";
import { formatPrice, formatDate } from "@/utils";
import { ORDER_STATUS_COLORS } from "@/constants";
import { ShoppingBag } from "lucide-react";
import type { Order } from "@/types/order.types";

export default function VendorOrdersPage() {
  const toast = useToast();
  const [orders, setOrders]     = useState<Order[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [statusFilter, setStatus] = useState("");

  const load = () => {
    setLoading(true);
    getVendorOrdersService({ status: statusFilter || undefined })
      .then((d) => setOrders(d.orders || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [statusFilter]);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    try {
      await orderService.updateStatus(id, status);
      toast.success(`Order marked as ${status}`);
      load();
    } catch { toast.error("Failed to update status"); }
    finally   { setUpdating(null); }
  };

  return (
    <ProtectedRoute allowedRoles={["vendor"]}>
      <div className="flex min-h-screen">
        <DashboardSidebar />
        <div className="flex-1 p-8">
          <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
            <div className="flex gap-2 flex-wrap">
              {["","confirmed","shipped","delivered","cancelled"].map((s) => (
                <Button key={s} size="sm"
                  variant={statusFilter === s ? "primary" : "ghost"}
                  onClick={() => setStatus(s)}>
                  {s || "All"}
                </Button>
              ))}
            </div>
          </div>

          {isLoading ? <PageLoader /> : orders.length === 0 ? (
            <EmptyState
              icon={<ShoppingBag className="h-12 w-12" />}
              title="No orders yet"
              message="Orders containing your products will appear here"
            />
          ) : (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {["Order","Customer","Items","Total","Status","Action"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((o) => (
                    <tr key={o._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">#{o._id.slice(-6).toUpperCase()}</p>
                        <p className="text-xs text-gray-400">{formatDate(o.createdAt)}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-700">{o.user?.fullName}</p>
                        <p className="text-xs text-gray-400">{o.user?.email}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{o.items.length} item(s)</td>
                      <td className="px-4 py-3 font-semibold text-gray-900">{formatPrice(o.total)}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${ORDER_STATUS_COLORS[o.status]}`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {o.status === "confirmed" && (
                          <Button size="sm" loading={updating === o._id}
                            onClick={() => updateStatus(o._id, "shipped")}>
                            Mark Shipped
                          </Button>
                        )}
                        {o.status === "shipped" && (
                          <Button size="sm" loading={updating === o._id}
                            onClick={() => updateStatus(o._id, "delivered")}>
                            Mark Delivered
                          </Button>
                        )}
                        {!["confirmed","shipped"].includes(o.status) && (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}