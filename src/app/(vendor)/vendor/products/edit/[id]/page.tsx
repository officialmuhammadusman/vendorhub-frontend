"use client";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFormik } from "formik";
import { productSchema } from "@/validations/productSchema";
import { Input }   from "@/components/ui/Input";
import { Button }  from "@/components/ui/Button";
import { PageLoader } from "@/components/ui/Spinner";
import { ProtectedRoute }   from "@/components/auth/ProtectedRoute";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { productService }   from "@/services/productService";
import { useToast }         from "@/hooks/useToast";
import { getErrorMessage }  from "@/utils";
import { APP_ROUTES, PRODUCT_CATEGORIES } from "@/constants";
import type { Product } from "@/types/product.types";
import { ImagePlus, X } from "lucide-react";

export default function EditProductPage() {
  const { id }  = useParams<{ id: string }>();
  const router  = useRouter();
  const toast   = useToast();
  const fileRef = useRef<HTMLInputElement>(null);

  const [product, setProduct]   = useState<Product | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    productService.getById(id)
      .then((p) => {
        setProduct(p);
        setPreviews(p.images.map((img: { url: string }) => img.url));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    const combined = [...newFiles, ...selected].slice(0, 5 - (product?.images.length || 0));
    setNewFiles(combined);
    const existingUrls = product?.images.map((i: { url: string }) => i.url) || [];
    setPreviews([...existingUrls, ...combined.map((f) => URL.createObjectURL(f))]);
  };

  const removeExistingImage = async (publicId: string) => {
    try {
      await productService.deleteImage(id, publicId);
      setProduct((prev) => prev ? { ...prev, images: prev.images.filter((img) => img.publicId !== publicId) } : prev);
      setPreviews((prev) => prev.filter((_, i) => (product?.images[i] as { publicId?: string })?.publicId !== publicId));
      toast.success("Image removed");
    } catch { toast.error("Failed to remove image"); }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title:         product?.title         || "",
      description:   product?.description   || "",
      price:         String(product?.price  || ""),
      discountPrice: String(product?.discountPrice || ""),
      category:      product?.category      || "",
      stock:         String(product?.stock  || ""),
      tags:          product?.tags?.join(",") || "",
    },
    validationSchema: productSchema,
    onSubmit: async (values) => {
      const fd = new FormData();
      Object.entries(values).forEach(([k, v]) => { if (v) fd.append(k, String(v)); });
      newFiles.forEach((f) => fd.append("images", f));
      try {
        await productService.update(id, fd);
        toast.success("Product updated!");
        router.push(APP_ROUTES.VENDOR.PRODUCTS);
      } catch (err) { toast.error(getErrorMessage(err)); }
    },
  });

  const err = (field: string) =>
    (formik.touched as Record<string,boolean>)[field] && (formik.errors as Record<string,string>)[field]
      ? (formik.errors as Record<string,string>)[field] : "";

  if (isLoading) return <PageLoader />;

  return (
    <ProtectedRoute allowedRoles={["vendor"]}>
      <div className="flex min-h-screen">
        <DashboardSidebar />
        <div className="flex-1 p-8">
          <h1 className="mb-6 text-2xl font-bold text-gray-900">Edit Product</h1>
          <form onSubmit={formik.handleSubmit}>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-5">
                <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
                  <Input label="Title" {...formik.getFieldProps("title")} error={err("title")} />
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
                    <textarea rows={4} {...formik.getFieldProps("description")}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Price ($)" type="number" step="0.01" {...formik.getFieldProps("price")} error={err("price")} />
                    <Input label="Discount ($)" type="number" step="0.01" {...formik.getFieldProps("discountPrice")} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
                      <select {...formik.getFieldProps("category")}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500">
                        {PRODUCT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <Input label="Stock" type="number" {...formik.getFieldProps("stock")} error={err("stock")} />
                  </div>
                  <Input label="Tags" placeholder="tag1,tag2" {...formik.getFieldProps("tags")} />
                </div>
              </div>

              <div className="space-y-5">
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                  <h2 className="mb-3 font-semibold text-gray-900">Images</h2>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {product?.images.map((img) => (
                      <div key={img.publicId} className="relative aspect-square overflow-hidden rounded-lg">
                        <img src={img.url} alt="" className="h-full w-full object-cover" />
                        <button type="button" onClick={() => removeExistingImage(img.publicId)}
                          className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    {(product?.images.length || 0) < 5 && (
                      <button type="button" onClick={() => fileRef.current?.click()}
                        className="flex aspect-square flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-gray-400 hover:border-indigo-400">
                        <ImagePlus className="h-6 w-6" />
                        <span className="text-xs mt-1">Add</span>
                      </button>
                    )}
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImages} />
                </div>
                <Button type="submit" fullWidth size="lg" loading={formik.isSubmitting}>Save Changes</Button>
                <Button type="button" variant="ghost" fullWidth onClick={() => router.back()}>Cancel</Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
