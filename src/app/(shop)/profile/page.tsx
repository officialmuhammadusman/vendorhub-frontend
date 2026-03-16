"use client";
import { useState, useRef } from "react";
import { useFormik } from "formik";
import { changePasswordSchema } from "@/validations/authSchema";
import { Input }   from "@/components/ui/Input";
import { Button }  from "@/components/ui/Button";
import { Avatar }  from "@/components/ui/Avatar";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth }  from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { fetchCurrentUser } from "@/store/slices/authSlice";
import { authService } from "@/services/authService";
import { getErrorMessage } from "@/utils";
import { Camera, User, Lock } from "lucide-react";

export default function ProfilePage() {
  const dispatch  = useAppDispatch();
  const toast     = useToast();
  const { user }  = useAuth();
  const fileRef   = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile"|"password">("profile");

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("avatar", file);
      await authService.updateProfile(fd);
      await dispatch(fetchCurrentUser());
      toast.success("Avatar updated!");
    } catch (err) { toast.error(getErrorMessage(err)); }
    finally { setUploading(false); }
  };

  const pwFormik = useFormik({
    initialValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
    validationSchema: changePasswordSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await authService.changePassword({ oldPassword: values.oldPassword, newPassword: values.newPassword });
        toast.success("Password changed!");
        resetForm();
      } catch (err) { toast.error(getErrorMessage(err)); }
    },
  });

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">My Profile</h1>

        {/* Avatar */}
        <div className="mb-6 flex items-center gap-5 rounded-xl border border-gray-200 bg-white p-6">
          <div className="relative">
            <Avatar src={user?.avatar?.url} name={user?.fullName} size="xl" />
            <button onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white shadow-md hover:bg-indigo-700">
              <Camera className="h-4 w-4" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900">{user?.fullName}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <span className="mt-1 inline-block rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-700 capitalize">
              {user?.role}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-4 rounded-lg bg-gray-100 p-1 w-fit">
          {(["profile","password"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}>
              {tab === "profile" ? <><User className="h-3.5 w-3.5 inline mr-1" />Profile</> : <><Lock className="h-3.5 w-3.5 inline mr-1" />Password</>}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="space-y-4">
              <Input label="Full Name" value={user?.fullName || ""} readOnly className="bg-gray-50" />
              <Input label="Email"     value={user?.email    || ""} readOnly className="bg-gray-50" />
              <Input label="Role"      value={user?.role     || ""} readOnly className="bg-gray-50 capitalize" />
            </div>
          </div>
        )}

        {/* Password Tab */}
        {activeTab === "password" && (
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <form onSubmit={pwFormik.handleSubmit} className="space-y-4">
              <Input label="Current Password" type="password" placeholder="••••••••"
                {...pwFormik.getFieldProps("oldPassword")}
                error={pwFormik.touched.oldPassword && pwFormik.errors.oldPassword ? pwFormik.errors.oldPassword : ""} />
              <Input label="New Password" type="password" placeholder="••••••••"
                {...pwFormik.getFieldProps("newPassword")}
                error={pwFormik.touched.newPassword && pwFormik.errors.newPassword ? pwFormik.errors.newPassword : ""} />
              <Input label="Confirm Password" type="password" placeholder="••••••••"
                {...pwFormik.getFieldProps("confirmPassword")}
                error={pwFormik.touched.confirmPassword && pwFormik.errors.confirmPassword ? pwFormik.errors.confirmPassword : ""} />
              <Button type="submit" loading={pwFormik.isSubmitting}>Change Password</Button>
            </form>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
