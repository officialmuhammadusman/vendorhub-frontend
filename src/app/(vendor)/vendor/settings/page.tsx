"use client";
import { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import { vendorSetupSchema } from "@/validations/vendorSchema";
import { Input }   from "@/components/ui/Input";
import { Button }  from "@/components/ui/Button";
import { PageLoader } from "@/components/ui/Spinner";
import { ProtectedRoute }   from "@/components/auth/ProtectedRoute";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { useVendor }  from "@/hooks/useVendor";
import { useToast }   from "@/hooks/useToast";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { setupVendor, updateVendorProfile } from "@/store/slices/vendorSlice";
import { getErrorMessage } from "@/utils";
import { Store, AlertCircle } from "lucide-react";

export default function VendorSettingsPage() {
  const dispatch = useAppDispatch();
  const toast    = useToast();
  const logoRef  = useRef<HTMLInputElement>(null);
  const bannerRef= useRef<HTMLInputElement>(null);
  const [logoPreview,   setLogoPreview]   = useState("");
  const [bannerPreview, setBannerPreview] = useState("");

  const { profile, isLoading, loadProfile } = useVendor();

  useEffect(() => { loadProfile(); }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      storeName:        profile?.storeName        || "",
      storeDescription: profile?.storeDescription || "",
      accountName:   profile?.bankDetails?.accountName   || "",
      accountNumber: profile?.bankDetails?.accountNumber || "",
      bankName:      profile?.bankDetails?.bankName      || "",
    },
    validationSchema: vendorSetupSchema,
    onSubmit: async (values) => {
      const fd = new FormData();
      fd.append("storeName",        values.storeName);
      fd.append("storeDescription", values.storeDescription);
      fd.append("bankDetails[accountName]",   values.accountName);
      fd.append("bankDetails[accountNumber]", values.accountNumber);
      fd.append("bankDetails[bankName]",      values.bankName);
      if (logoRef.current?.files?.[0])   fd.append("storeLogo",   logoRef.current.files[0]);
      if (bannerRef.current?.files?.[0]) fd.append("storeBanner", bannerRef.current.files[0]);

      try {
        if (profile) {
          await dispatch(updateVendorProfile(fd));
          toast.success("Store updated!");
        } else {
          await dispatch(setupVendor(fd));
          toast.success("Store created! Awaiting admin approval.");
        }
        loadProfile();
      } catch (err) { toast.error(getErrorMessage(err)); }
    },
  });

  if (isLoading) return <PageLoader />;

  return (
    <ProtectedRoute allowedRoles={["vendor"]}>
      <div className="flex min-h-screen">
        <DashboardSidebar />
        <div className="flex-1 p-8">
          <h1 className="mb-6 text-2xl font-bold text-gray-900">Store Settings</h1>

          {/* Status banner */}
          {profile && profile.status !== "approved" && (
            <div className={`mb-6 flex items-center gap-3 rounded-xl px-5 py-4 ${
              profile.status === "pending"   ? "bg-yellow-50 border border-yellow-200 text-yellow-800" :
              profile.status === "suspended" ? "bg-red-50 border border-red-200 text-red-800" : ""
            }`}>
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              {profile.status === "pending"   && "Your store is pending admin approval. You can edit details but cannot add products yet."}
              {profile.status === "suspended" && "Your store has been suspended. Contact support for more information."}
            </div>
          )}

          {!profile && (
            <div className="mb-6 flex items-center gap-3 rounded-xl bg-indigo-50 border border-indigo-200 px-5 py-4 text-indigo-800">
              <Store className="h-5 w-5 flex-shrink-0" />
              Set up your store profile to start selling. Your store will need admin approval before you can add products.
            </div>
          )}

          <form onSubmit={formik.handleSubmit} className="max-w-2xl space-y-6">
            {/* Store Info */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
              <h2 className="font-semibold text-gray-900">Store Information</h2>
              <Input label="Store Name *" placeholder="Tech Haven Store"
                {...formik.getFieldProps("storeName")}
                error={formik.touched.storeName && formik.errors.storeName ? formik.errors.storeName : ""} />
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Store Description</label>
                <textarea rows={3} placeholder="Tell customers about your store..."
                  {...formik.getFieldProps("storeDescription")}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
              </div>

              {/* Logo & Banner */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Store Logo</label>
                  <div className="relative h-24 w-24 overflow-hidden rounded-xl border-2 border-dashed border-gray-300 cursor-pointer hover:border-indigo-400"
                    onClick={() => logoRef.current?.click()}>
                    {(logoPreview || profile?.storeLogo?.url)
                      ? <img src={logoPreview || profile?.storeLogo?.url} alt="" className="h-full w-full object-cover" />
                      : <div className="flex h-full flex-col items-center justify-center text-gray-400 text-xs">Click</div>}
                  </div>
                  <input ref={logoRef} type="file" accept="image/*" className="hidden"
                    onChange={(e) => e.target.files?.[0] && setLogoPreview(URL.createObjectURL(e.target.files[0]))} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Store Banner</label>
                  <div className="relative h-24 w-full overflow-hidden rounded-xl border-2 border-dashed border-gray-300 cursor-pointer hover:border-indigo-400"
                    onClick={() => bannerRef.current?.click()}>
                    {(bannerPreview || profile?.storeBanner?.url)
                      ? <img src={bannerPreview || profile?.storeBanner?.url} alt="" className="h-full w-full object-cover" />
                      : <div className="flex h-full flex-col items-center justify-center text-gray-400 text-xs">Click</div>}
                  </div>
                  <input ref={bannerRef} type="file" accept="image/*" className="hidden"
                    onChange={(e) => e.target.files?.[0] && setBannerPreview(URL.createObjectURL(e.target.files[0]))} />
                </div>
              </div>
            </div>

            {/* Bank Details */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
              <h2 className="font-semibold text-gray-900">Bank Details</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input label="Account Name"   placeholder="Jane Vendor" {...formik.getFieldProps("accountName")} />
                <Input label="Account Number" placeholder="1234567890"  {...formik.getFieldProps("accountNumber")} />
                <Input label="Bank Name"      placeholder="HBL Bank"    {...formik.getFieldProps("bankName")} />
              </div>
            </div>

            <Button type="submit" size="lg" loading={formik.isSubmitting}>
              {profile ? "Save Changes" : "Create Store"}
            </Button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
