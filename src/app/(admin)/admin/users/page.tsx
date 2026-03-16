"use client";
import { useEffect, useState } from "react";
import { ProtectedRoute }   from "@/components/auth/ProtectedRoute";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { Button }   from "@/components/ui/Button";
import { Avatar }   from "@/components/ui/Avatar";
import { Input }    from "@/components/ui/Input";
import { PageLoader } from "@/components/ui/Spinner";
import { adminService } from "@/services/adminService";
import { useToast }     from "@/hooks/useToast";
import { formatDate }   from "@/utils";
import { Search }       from "lucide-react";
import type { User }    from "@/types/auth.types";

export default function AdminUsersPage() {
  const toast = useToast();
  const [users, setUsers]       = useState<User[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [search, setSearch]     = useState("");
  const [roleFilter, setRole]   = useState("");

  const load = () => {
    setLoading(true);
    adminService.getUsers({ search: search || undefined, role: roleFilter || undefined })
      .then((d) => setUsers(d.users || d))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [roleFilter]);

  const toggleUser = async (id: string) => {
    try { await adminService.toggleUser(id); toast.success("User status updated"); load(); }
    catch { toast.error("Failed to update user"); }
  };

  const ROLE_COLORS: Record<string, string> = {
    customer: "bg-blue-100 text-blue-700",
    vendor:   "bg-purple-100 text-purple-700",
    admin:    "bg-red-100 text-red-700",
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="flex min-h-screen">
        <DashboardSidebar />
        <div className="flex-1 p-8">
          <h1 className="mb-6 text-2xl font-bold text-gray-900">Users</h1>

          {/* Filters */}
          <div className="mb-4 flex gap-3 flex-wrap">
            <div className="flex-1 min-w-48">
              <Input placeholder="Search by name or email..." value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && load()}
                leftIcon={<Search className="h-4 w-4" />} />
            </div>
            <div className="flex gap-2">
              {["","customer","vendor","admin"].map((r) => (
                <Button key={r} size="sm" variant={roleFilter === r ? "primary" : "ghost"} onClick={() => setRole(r)}>
                  {r || "All"}
                </Button>
              ))}
            </div>
          </div>

          {isLoading ? <PageLoader /> : (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {["User","Role","Status","Joined","Action"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar src={u.avatar?.url} name={u.fullName} size="sm" />
                          <div>
                            <p className="font-medium text-gray-900">{u.fullName}</p>
                            <p className="text-xs text-gray-500">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${ROLE_COLORS[u.role]}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${u.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {u.isActive ? "Active" : "Banned"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(u.createdAt)}</td>
                      <td className="px-4 py-3">
                        {u.role !== "admin" && (
                          <Button size="sm" variant={u.isActive ? "danger" : "secondary"} onClick={() => toggleUser(u._id)}>
                            {u.isActive ? "Ban" : "Unban"}
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No users found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
