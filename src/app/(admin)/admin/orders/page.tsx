"use client";
import { useEffect, useState } from "react";
import { ProtectedRoute }   from "@/components/auth/ProtectedRoute";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { Button }     from "@/components/ui/Button";
import { PageLoader } from "@/components/ui/Spinner";
import { Pagination } from "@/components/ui/Pagination";
import { adminService } from "@/services/adminService";
import { formatPrice, formatDate } from "@/utils";
import { ORDER_STATUS_COLORS, PAYMENT_STATUS_COLORS } from "@/constants";
import type { Order } from "@/types/order.types";

export default function AdminOrdersPage() {
  const [orders, setOrders]     = useState<Order[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [statusFilter, setStatus] = useState("");
  const [page, setPage]         = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const load = (p = 1) => {
    setLoading(true);
    adminService.getOrders({ status: statusFilter || undefined, page: p, limit: 15 })
      .then((d) => {
        setOrders(d.orders || d);
        setTotalPages(d.pagination?.totalPages || 1);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { setPage(1); load(1); }, [statusFilter]);

  const STATUS_LIST = ["", "pending", "confirmed", "shipped", "delivered", "cancelled"];

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="flex min-h-screen">
        <DashboardSidebar />
        <div className="flex-1 p-8">
          <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
            <h1 className="text-2xl font-bold text-gray-900">All Orders</h1>
            <div className="flex flex-wrap gap-2">
              {STATUS_LIST.map((s) => (
                <Button key={s} size="sm" variant={statusFilter === s ? "primary" : "ghost"} onClick={() => setStatus(s)}>
                  {s || "All"}
                </Button>
              ))}
            </div>
          </div>
          {isLoading ? <PageLoader /> : (
            <>
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white mb-6">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {["Order ID","Customer","Items","Total","Status","Payment","Date"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.map((o) => (
                      <tr key={o._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-xs text-gray-700">#{o._id.slice(-8).toUpperCase()}</td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900">{o.user?.fullName}</p>
                          <p className="text-xs text-gray-400">{o.user?.email}</p>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{o.items?.length}</td>
                        <td className="px-4 py-3 font-semibold text-gray-900">{formatPrice(o.total)}</td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${ORDER_STATUS_COLORS[o.status]}`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${PAYMENT_STATUS_COLORS[o.paymentStatus]}`}>
                            {o.paymentStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500">{formatDate(o.createdAt)}</td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr><td colSpan={7} className="py-8 text-center text-gray-400">No orders found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              <Pagination page={page} totalPages={totalPages} onPageChange={(p) => { setPage(p); load(p); }} />
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
