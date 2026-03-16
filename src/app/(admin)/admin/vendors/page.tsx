"use client";
import { useEffect, useState } from "react";
import { ProtectedRoute }   from "@/components/auth/ProtectedRoute";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { Button }           from "@/components/ui/Button";
import { Badge }            from "@/components/ui/Badge";
import { PageLoader }       from "@/components/ui/Spinner";
import { Avatar }           from "@/components/ui/Avatar";
import { adminService }     from "@/services/adminService";
import { useToast }         from "@/hooks/useToast";
import { VENDOR_STATUS_COLORS } from "@/constants";
import { formatDate }       from "@/utils";
import type { Vendor } from "@/types/vendor.types";

export default function AdminVendorsPage() {
  const toast = useToast();
  const [vendors, setVendors]   = useState<Vendor[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [filter, setFilter]     = useState("pending");

  const load = () => {
    setLoading(true);
    adminService.getVendors({ status: filter })
      .then((d) => setVendors(d.vendors || d))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filter]);

  const approve = async (id: string) => {
    try { await adminService.approveVendor(id); toast.success("Vendor approved!"); load(); }
    catch { toast.error("Failed to approve vendor"); }
  };

  const suspend = async (id: string) => {
    try { await adminService.suspendVendor(id); toast.success("Vendor suspended"); load(); }
    catch { toast.error("Failed to suspend vendor"); }
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="flex min-h-screen">
        <DashboardSidebar />
        <div className="flex-1 p-8">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Vendors</h1>
            <div className="flex gap-2">
              {["pending","approved","suspended"].map((s) => (
                <Button key={s} size="sm" variant={filter === s ? "primary" : "ghost"} onClick={() => setFilter(s)}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {isLoading ? <PageLoader /> : (
            <div className="space-y-3">
              {vendors.map((vendor) => (
                <div key={vendor._id} className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar src={vendor.storeLogo?.url} name={vendor.storeName} />
                    <div>
                      <p className="font-medium text-gray-900">{vendor.storeName}</p>
                      <p className="text-sm text-gray-500">{vendor.user?.email} · {formatDate(vendor.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${VENDOR_STATUS_COLORS[vendor.status]}`}>
                      {vendor.status}
                    </span>
                    {vendor.status === "pending" && (
                      <Button size="sm" onClick={() => approve(vendor._id)}>Approve</Button>
                    )}
                    {vendor.status === "approved" && (
                      <Button size="sm" variant="danger" onClick={() => suspend(vendor._id)}>Suspend</Button>
                    )}
                  </div>
                </div>
              ))}
              {vendors.length === 0 && <p className="py-12 text-center text-gray-400">No {filter} vendors</p>}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
