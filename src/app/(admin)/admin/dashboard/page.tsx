"use client";
import { useEffect, useState } from "react";
import { ProtectedRoute }    from "@/components/auth/ProtectedRoute";
import { DashboardSidebar }  from "@/components/layout/DashboardSidebar";
import { StatsCard }         from "@/components/vendor/StatsCard";
import { PageLoader }        from "@/components/ui/Spinner";
import { adminService }      from "@/services/adminService";
import { formatPrice }       from "@/utils";
import { Users, Store, Package, ShoppingBag, DollarSign, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function AdminDashboardPage() {
  const [stats, setStats]       = useState<Record<string,unknown> | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="flex min-h-screen">
        <DashboardSidebar />
        <div className="flex-1 p-8">
          <h1 className="mb-6 text-2xl font-bold text-gray-900">Platform Overview</h1>
          {isLoading ? <PageLoader /> : (
            <>
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                <StatsCard title="Total Users"     value={String(stats?.totalUsers || 0)}     icon={Users} />
                <StatsCard title="Total Vendors"   value={String(stats?.totalVendors || 0)}   icon={Store} />
                <StatsCard title="Total Products"  value={String(stats?.totalProducts || 0)}  icon={Package} />
                <StatsCard title="Total Orders"    value={String(stats?.totalOrders || 0)}    icon={ShoppingBag} />
                <StatsCard title="Total Revenue"   value={formatPrice(Number(stats?.totalRevenue || 0))} icon={DollarSign} />
                <StatsCard title="Pending Vendors" value={String(stats?.pendingVendors || 0)} icon={Clock}
                  className={Number(stats?.pendingVendors || 0) > 0 ? "border-yellow-300" : ""} />
              </div>

              {Array.isArray(stats?.monthlyRevenue) && (stats.monthlyRevenue as unknown[]).length > 0 && (
                <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
                  <h2 className="mb-4 text-lg font-semibold text-gray-900">Monthly Revenue</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats!.monthlyRevenue as Record<string,unknown>[]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
                      <Tooltip formatter={(v: number) => formatPrice(v)} />
                      <Bar dataKey="revenue" fill="#4f46e5" radius={[4,4,0,0]} />
                    </BarChart>
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
