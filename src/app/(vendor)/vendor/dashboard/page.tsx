"use client";
import { useEffect } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { StatsCard }   from "@/components/vendor/StatsCard";
import { PageLoader }  from "@/components/ui/Spinner";
import { useVendor }   from "@/hooks/useVendor";
import { formatPrice } from "@/utils";
import { TrendingUp, Package, ShoppingBag, AlertTriangle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function VendorDashboardPage() {
  const { dashboard, earnings, isLoading, loadDashboard, loadEarnings } = useVendor();

  useEffect(() => { loadDashboard(); loadEarnings(); }, []);

  return (
    <ProtectedRoute allowedRoles={["vendor"]}>
      <div className="flex min-h-screen">
        <DashboardSidebar />
        <div className="flex-1 p-8">
          <h1 className="mb-6 text-2xl font-bold text-gray-900">Dashboard</h1>
          {isLoading ? <PageLoader /> : (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard title="Total Earnings"  value={formatPrice(dashboard?.totalEarnings || 0)} icon={TrendingUp} />
                <StatsCard title="Total Orders"    value={dashboard?.totalOrders    || 0} icon={ShoppingBag} />
                <StatsCard title="Total Products"  value={dashboard?.totalProducts  || 0} icon={Package} />
                <StatsCard title="Low Stock Items" value={dashboard?.lowStockProducts || 0} icon={AlertTriangle}
                  className={(dashboard?.lowStockProducts || 0) > 0 ? "border-yellow-300" : ""} />
              </div>

              {earnings?.monthlyEarnings && earnings.monthlyEarnings.length > 0 && (
                <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
                  <h2 className="mb-4 text-lg font-semibold text-gray-900">Monthly Earnings</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={earnings.monthlyEarnings}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
                      <Tooltip formatter={(v: number) => formatPrice(v)} />
                      <Line type="monotone" dataKey="earnings" stroke="#4f46e5" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
