"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { productSchema } from "@/validations/productSchema";
import { Input }   from "@/components/ui/Input";
import { Button }  from "@/components/ui/Button";
import { ProtectedRoute }   from "@/components/auth/ProtectedRoute";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { productService }   from "@/services/productService";
import { useToast }         from "@/hooks/useToast";
import { getErrorMessage }  from "@/utils";
import { APP_ROUTES, PRODUCT_CATEGORIES } from "@/constants";
import { ImagePlus, X } from "lucide-react";

export default function AddProductPage() {
  const router   = useRouter();
  const toast    = useToast();
  const fileRef  = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  const [files, setFiles]       = useState<File[]>([]);

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    const combined = [...files, ...selected].slice(0, 5);
    setFiles(combined);
    setPreviews(combined.map((f) => URL.createObjectURL(f)));
  };

  const removeImage = (i: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
    setPreviews((prev) => prev.filter((_, idx) => idx !== i));
  };

  const formik = useFormik({
    initialValues: { title: "", description: "", price: "", discountPrice: "", category: "", stock: "", tags: "" },
    validationSchema: productSchema,
    onSubmit: async (values) => {
      if (!files.length) { toast.error("Please add at least one image"); return; }
      const fd = new FormData();
      Object.entries(values).forEach(([k, v]) => { if (v) fd.append(k, String(v)); });
      files.forEach((f) => fd.append("images", f));
      try {
        await productService.create(fd);
        toast.success("Product created!");
        router.push(APP_ROUTES.VENDOR.PRODUCTS);
      } catch (err) { toast.error(getErrorMessage(err)); }
    },
  });

  const err = (field: string) =>
    (formik.touched as Record<string,boolean>)[field] && (formik.errors as Record<string,string>)[field]
      ? (formik.errors as Record<string,string>)[field] : "";

  return (
    <ProtectedRoute allowedRoles={["vendor"]}>
      <div className="flex min-h-screen">
        <DashboardSidebar />
        <div className="flex-1 p-8">
          <h1 className="mb-6 text-2xl font-bold text-gray-900">Add New Product</h1>

          <form onSubmit={formik.handleSubmit}>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Main Info */}
              <div className="lg:col-span-2 space-y-5">
                <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
                  <h2 className="font-semibold text-gray-900">Product Details</h2>
                  <Input label="Title" placeholder="iPhone 15 Case" {...formik.getFieldProps("title")} error={err("title")} />
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
                    <textarea rows={4} placeholder="Describe your product in detail..."
                      {...formik.getFieldProps("description")}
                      className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 ${err("description") ? "border-red-400" : "border-gray-300"}`} />
                    {err("description") && <p className="mt-1 text-xs text-red-600">{err("description")}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Price ($)" type="number" step="0.01" placeholder="29.99" {...formik.getFieldProps("price")} error={err("price")} />
                    <Input label="Discount Price ($)" type="number" step="0.01" placeholder="24.99 (optional)" {...formik.getFieldProps("discountPrice")} error={err("discountPrice")} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
                      <select {...formik.getFieldProps("category")}
                        className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-indigo-500 ${err("category") ? "border-red-400" : "border-gray-300"}`}>
                        <option value="">Select category</option>
                        {PRODUCT_CATEGORIES.map((c) => (
                          <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                        ))}
                      </select>
                      {err("category") && <p className="mt-1 text-xs text-red-600">{err("category")}</p>}
                    </div>
                    <Input label="Stock" type="number" placeholder="100" {...formik.getFieldProps("stock")} error={err("stock")} />
                  </div>
                  <Input label="Tags (comma separated)" placeholder="iphone,case,leather" {...formik.getFieldProps("tags")} error={err("tags")} />
                </div>
              </div>

              {/* Images + Submit */}
              <div className="space-y-5">
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                  <h2 className="mb-3 font-semibold text-gray-900">Images (max 5)</h2>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {previews.map((src, i) => (
                      <div key={i} className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                        <img src={src} alt="" className="h-full w-full object-cover" />
                        <button type="button" onClick={() => removeImage(i)}
                          className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    {previews.length < 5 && (
                      <button type="button" onClick={() => fileRef.current?.click()}
                        className="flex aspect-square flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-gray-400 hover:border-indigo-400 hover:text-indigo-500">
                        <ImagePlus className="h-6 w-6" />
                        <span className="text-xs mt-1">Add</span>
                      </button>
                    )}
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImages} />
                </div>

                <Button type="submit" fullWidth size="lg" loading={formik.isSubmitting}>
                  Publish Product
                </Button>
                <Button type="button" variant="ghost" fullWidth onClick={() => router.back()}>
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
