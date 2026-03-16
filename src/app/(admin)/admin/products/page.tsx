"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ProtectedRoute }   from "@/components/auth/ProtectedRoute";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { Button }     from "@/components/ui/Button";
import { Badge }      from "@/components/ui/Badge";
import { Input }      from "@/components/ui/Input";
import { PageLoader } from "@/components/ui/Spinner";
import { adminService } from "@/services/adminService";
import { useToast }     from "@/hooks/useToast";
import { formatPrice }  from "@/utils";
import { Search }       from "lucide-react";
import type { Product } from "@/types/product.types";

export default function AdminProductsPage() {
  const toast = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [search, setSearch]     = useState("");

  const load = () => {
    setLoading(true);
    adminService.getProducts()
      .then((d) => setProducts(d.products || d))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const removeProduct = async (id: string) => {
    if (!confirm("Deactivate this product?")) return;
    try { await adminService.removeProduct(id); toast.success("Product deactivated"); load(); }
    catch { toast.error("Failed"); }
  };

  const filtered = products.filter((p) =>
    !search || p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="flex min-h-screen bg-slate-50">
        <DashboardSidebar />
        <div className="flex-1 p-8">

          <div className="mb-6 flex items-center justify-between gap-4">
            <h1 className="text-2xl font-black text-slate-900">All Products</h1>
            <div className="w-72">
              <Input
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>
          </div>

          {isLoading ? <PageLoader /> : (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    {["Product", "Vendor", "Price", "Stock", "Status", "Action"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((p) => (
                    <tr key={p._id} className="hover:bg-slate-50 transition-colors duration-100">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                            <Image
                              src={p.images[0]?.url || "/placeholder.png"}
                              alt={p.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <p className="font-medium text-slate-900 line-clamp-1 max-w-48">{p.title}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs">
                        {(p.vendor as { storeName?: string })?.storeName}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {formatPrice(p.discountPrice || p.price)}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{p.stock}</td>
                      <td className="px-4 py-3">
                        <Badge variant={p.isActive ? "success" : "danger"}>
                          {p.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        {p.isActive && (
                          <Button size="sm" variant="danger" onClick={() => removeProduct(p._id)}>
                            Remove
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        No products found
                      </td>
                    </tr>
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