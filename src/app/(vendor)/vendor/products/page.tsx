"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import { ProtectedRoute }   from "@/components/auth/ProtectedRoute";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { Button }    from "@/components/ui/Button";
import { Badge }     from "@/components/ui/Badge";
import { Modal }     from "@/components/ui/Modal";
import { PageLoader } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { useProducts }    from "@/hooks/useProducts";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { deleteProduct }  from "@/store/slices/productSlice";
import { formatPrice }    from "@/utils";
import { APP_ROUTES, LOW_STOCK_THRESHOLD } from "@/constants";
import { Plus, Pencil, Trash2, Package, AlertTriangle } from "lucide-react";
import type { Product } from "@/types/product.types";

export default function VendorProductsPage() {
  const dispatch = useAppDispatch();
  const { myProducts, isLoading, loadMyProducts } = useProducts();

  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [isDeleting,   setIsDeleting]   = useState(false);

  useEffect(() => { loadMyProducts({}); }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await dispatch(deleteProduct(deleteTarget._id));
      toast.success(`"${deleteTarget.title}" deleted successfully`);
      setDeleteTarget(null);
      loadMyProducts({});
    } catch {
      toast.error("Failed to delete product. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const products = myProducts?.products || [];

  return (
    <ProtectedRoute allowedRoles={["vendor"]}>
      <div className="flex min-h-screen bg-slate-50">
        <DashboardSidebar />

        <div className="flex-1 p-8">
          {/* Page header */}
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-black text-slate-900">My Products</h1>
            <Link href={APP_ROUTES.VENDOR.ADD}>
              <Button>
                <Plus className="h-4 w-4" />
                Add Product
              </Button>
            </Link>
          </div>

          {isLoading ? <PageLoader /> : products.length === 0 ? (
            <EmptyState
              icon={<Package className="h-7 w-7" />}
              title="No products yet"
              message="Add your first product to start selling"
              action={
                <Link href={APP_ROUTES.VENDOR.ADD}>
                  <Button>Add Your First Product</Button>
                </Link>
              }
            />
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full text-sm">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    {["Product", "Price", "Stock", "Status", "Actions"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((p: Product) => (
                    <tr key={p._id} className="hover:bg-slate-50 transition-colors duration-100">

                      {/* Product */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-slate-100 border border-slate-200 flex-shrink-0">
                            <Image
                              src={p.images[0]?.url || "/placeholder.png"}
                              alt={p.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 line-clamp-1">{p.title}</p>
                            <p className="text-xs text-slate-400 capitalize">{p.category}</p>
                          </div>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {formatPrice(p.discountPrice || p.price)}
                      </td>

                      {/* Stock */}
                      <td className="px-4 py-3">
                        <span className={
                          p.stock === 0
                            ? "font-semibold text-red-500"
                            : p.stock <= LOW_STOCK_THRESHOLD
                            ? "font-semibold text-amber-600"
                            : "text-slate-700"
                        }>
                          {p.stock}
                        </span>
                        {p.stock <= LOW_STOCK_THRESHOLD && p.stock > 0 && (
                          <span className="ml-1.5 inline-flex items-center rounded-full bg-amber-50 border border-amber-200 px-1.5 py-0.5 text-[10px] font-semibold text-amber-600">
                            Low
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <Badge variant={p.isActive ? "success" : "danger"}>
                          {p.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <Link href={APP_ROUTES.VENDOR.EDIT(p._id)}>
                            <Button variant="ghost" size="sm">
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteTarget(p)}
                          >
                            <Trash2 className="h-3.5 w-3.5 text-red-500" />
                          </Button>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Delete confirmation modal ── */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => !isDeleting && setDeleteTarget(null)}
        size="sm"
      >
        <div className="flex flex-col items-center text-center">
          {/* Warning icon */}
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 border border-red-200">
            <AlertTriangle className="h-6 w-6 text-red-500" />
          </div>

          <h3 className="text-base font-bold text-slate-900 mb-1">Delete Product</h3>
          <p className="text-sm text-slate-500 mb-1">
            Are you sure you want to delete
          </p>
          <p className="text-sm font-semibold text-slate-800 mb-5 px-2 line-clamp-2">
            "{deleteTarget?.title}"
          </p>
          <p className="text-xs text-slate-400 mb-6">
            This action cannot be undone.
          </p>

          <div className="flex w-full gap-3">
            <Button
              variant="secondary"
              fullWidth
              disabled={isDeleting}
              onClick={() => setDeleteTarget(null)}
            >
              Cancel
            </Button>
            <Button
              fullWidth
              loading={isDeleting}
              onClick={handleDelete}
              className="!bg-red-500 hover:!bg-red-600 !shadow-sm !shadow-red-200"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>

    </ProtectedRoute>
  );
}