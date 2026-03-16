"use client";
import { useEffect } from "react";
import { ProtectedRoute }   from "@/components/auth/ProtectedRoute";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { StatsCard }  from "@/components/vendor/StatsCard";
import { PageLoader } from "@/components/ui/Spinner";
import { useVendor }  from "@/hooks/useVendor";
import { formatPrice } from "@/utils";
import { TrendingUp, ShoppingBag } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function VendorEarningsPage() {
  const { earnings, isLoading, loadEarnings } = useVendor();
  useEffect(() => { loadEarnings(); }, []);

  return (
    <ProtectedRoute allowedRoles={["vendor"]}>
      <div className="flex min-h-screen">
        <DashboardSidebar />
        <div className="flex-1 p-8">
          <h1 className="mb-6 text-2xl font-bold text-gray-900">Earnings</h1>
          {isLoading ? <PageLoader /> : (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-8">
                <StatsCard title="Total Earnings" value={formatPrice(earnings?.totalEarnings || 0)} icon={TrendingUp} />
                <StatsCard title="Total Orders"   value={earnings?.totalOrders || 0}               icon={ShoppingBag} />
              </div>
              {earnings?.monthlyEarnings && earnings.monthlyEarnings.length > 0 ? (
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                  <h2 className="mb-4 text-lg font-semibold text-gray-900">Monthly Earnings</h2>
                  <ResponsiveContainer width="100%" height={320}>
                    <AreaChart data={earnings.monthlyEarnings}>
                      <defs>
                        <linearGradient id="earn" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="#4f46e5" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}    />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
                      <Tooltip formatter={(v: number) => [formatPrice(v), "Earnings"]} />
                      <Area type="monotone" dataKey="earnings" stroke="#4f46e5" strokeWidth={2} fill="url(#earn)" dot={{ r: 4, fill: "#4f46e5" }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-center text-gray-400 py-12">No earnings data yet</p>
              )}
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
