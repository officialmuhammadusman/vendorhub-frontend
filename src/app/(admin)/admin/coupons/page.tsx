"use client";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ProtectedRoute }   from "@/components/auth/ProtectedRoute";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { Button }    from "@/components/ui/Button";
import { Input }     from "@/components/ui/Input";
import { Modal }     from "@/components/ui/Modal";
import { Badge }     from "@/components/ui/Badge";
import { PageLoader } from "@/components/ui/Spinner";
import { adminService } from "@/services/adminService";
import { useToast }     from "@/hooks/useToast";
import { formatDate }   from "@/utils";
import { Plus, Tag, ToggleLeft, ToggleRight, Trash2 } from "lucide-react";

interface Coupon {
  _id: string; code: string; discountType: "percentage" | "fixed";
  discountValue: number; minOrderAmount: number; maxDiscount?: number;
  usageLimit: number; usedCount: number; isActive: boolean; expiresAt: string;
}

const schema = Yup.object({
  code:           Yup.string().required("Code is required"),
  discountType:   Yup.string().oneOf(["percentage","fixed"]).required(),
  discountValue:  Yup.number().min(1).required("Value required"),
  minOrderAmount: Yup.number().min(0),
  maxDiscount:    Yup.number().min(0),
  usageLimit:     Yup.number().min(1).required("Usage limit required"),
  expiresAt:      Yup.string().required("Expiry date required"),
});

export default function AdminCouponsPage() {
  const toast = useToast();
  const [coupons, setCoupons]   = useState<Coupon[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [showModal, setModal]   = useState(false);

  const load = () => {
    setLoading(true);
    adminService.getOrders() // placeholder - use coupon service
      .then(() => {})
      .catch(() => {})
      .finally(() => setLoading(false));
    // Direct fetch
    import("@/services/adminService").then(({ adminService: svc }) => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/coupons`, {
        headers: { Authorization: `Bearer ${document.cookie.match(/token=([^;]+)/)?.[1] || ""}` }
      })
      .then(() => {})
      .catch(() => {});
    });
    // Use axios directly
    import("@/lib/axios").then(({ default: ax }) => {
      ax.get("/coupons")
        .then((r) => setCoupons(r.data.data || []))
        .catch(console.error)
        .finally(() => setLoading(false));
    });
  };

  useEffect(() => { load(); }, []);

  const toggle = async (id: string) => {
    try {
      await import("@/lib/axios").then(({ default: ax }) => ax.patch(`/coupons/${id}`));
      toast.success("Coupon toggled"); load();
    } catch { toast.error("Failed"); }
  };

  const deleteCoupon = async (id: string) => {
    if (!confirm("Delete this coupon?")) return;
    try {
      await import("@/lib/axios").then(({ default: ax }) => ax.delete(`/coupons/${id}`));
      toast.success("Coupon deleted"); load();
    } catch { toast.error("Failed"); }
  };

  const formik = useFormik({
    initialValues: { code: "", discountType: "percentage", discountValue: "", minOrderAmount: "", maxDiscount: "", usageLimit: "", expiresAt: "" },
    validationSchema: schema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await import("@/lib/axios").then(({ default: ax }) => ax.post("/coupons", {
          ...values, discountValue: Number(values.discountValue),
          minOrderAmount: Number(values.minOrderAmount) || 0,
          maxDiscount:    Number(values.maxDiscount)    || undefined,
          usageLimit:     Number(values.usageLimit),
        }));
        toast.success("Coupon created!"); setModal(false); resetForm(); load();
      } catch (e: unknown) {
        const err = e as { response?: { data?: { message?: string } } };
        toast.error(err?.response?.data?.message || "Failed");
      }
    },
  });

  const err = (f: string) => (formik.touched as Record<string,boolean>)[f] && (formik.errors as Record<string,string>)[f] ? (formik.errors as Record<string,string>)[f] : "";

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="flex min-h-screen">
        <DashboardSidebar />
        <div className="flex-1 p-8">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Coupons</h1>
            <Button onClick={() => setModal(true)}><Plus className="h-4 w-4" /> Create Coupon</Button>
          </div>

          {isLoading ? <PageLoader /> : (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {["Code","Type","Value","Min Order","Used","Status","Expires","Actions"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {coupons.map((c) => (
                    <tr key={c._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-indigo-500" />
                          <span className="font-mono font-semibold text-gray-900">{c.code}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 capitalize text-gray-600">{c.discountType}</td>
                      <td className="px-4 py-3 font-semibold text-gray-900">
                        {c.discountType === "percentage" ? `${c.discountValue}%` : `$${c.discountValue}`}
                      </td>
                      <td className="px-4 py-3 text-gray-600">${c.minOrderAmount}</td>
                      <td className="px-4 py-3 text-gray-600">{c.usedCount}/{c.usageLimit}</td>
                      <td className="px-4 py-3">
                        <Badge variant={c.isActive ? "success" : "danger"}>{c.isActive ? "Active" : "Inactive"}</Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">{formatDate(c.expiresAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Button size="sm" variant="ghost" onClick={() => toggle(c._id)}>
                            {c.isActive ? <ToggleRight className="h-4 w-4 text-green-500" /> : <ToggleLeft className="h-4 w-4 text-gray-400" />}
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => deleteCoupon(c._id)}>
                            <Trash2 className="h-4 w-4 text-red-400" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {coupons.length === 0 && (
                    <tr><td colSpan={8} className="py-8 text-center text-gray-400">No coupons yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      <Modal isOpen={showModal} onClose={() => setModal(false)} title="Create Coupon" size="lg">
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Coupon Code" placeholder="SAVE20" {...formik.getFieldProps("code")}
              onChange={(e) => formik.setFieldValue("code", e.target.value.toUpperCase())}
              error={err("code")} />
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Discount Type</label>
              <select {...formik.getFieldProps("discountType")}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500">
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed ($)</option>
              </select>
            </div>
            <Input label={formik.values.discountType === "percentage" ? "Discount %" : "Discount $"}
              type="number" placeholder={formik.values.discountType === "percentage" ? "20" : "10"}
              {...formik.getFieldProps("discountValue")} error={err("discountValue")} />
            <Input label="Min Order Amount ($)" type="number" placeholder="50"
              {...formik.getFieldProps("minOrderAmount")} />
            {formik.values.discountType === "percentage" && (
              <Input label="Max Discount ($)" type="number" placeholder="30"
                {...formik.getFieldProps("maxDiscount")} />
            )}
            <Input label="Usage Limit" type="number" placeholder="100"
              {...formik.getFieldProps("usageLimit")} error={err("usageLimit")} />
            <Input label="Expires At" type="datetime-local"
              {...formik.getFieldProps("expiresAt")} error={err("expiresAt")} />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={formik.isSubmitting} fullWidth>Create Coupon</Button>
            <Button type="button" variant="ghost" onClick={() => setModal(false)} fullWidth>Cancel</Button>
          </div>
        </form>
      </Modal>
    </ProtectedRoute>
  );
}
