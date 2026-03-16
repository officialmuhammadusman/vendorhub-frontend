"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { registerSchema } from "@/validations/authSchema";
import { Input }   from "@/components/ui/Input";
import { Button }  from "@/components/ui/Button";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { registerUser }   from "@/store/slices/authSlice";
import { useToast }       from "@/hooks/useToast";
import { APP_ROUTES, USER_ROLES } from "@/constants";
import { Store, User, Mail, Lock, ShoppingBag, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const router   = useRouter();
  const toast    = useToast();

  const formik = useFormik({
    initialValues: { fullName: "", email: "", password: "", role: "customer" as "customer" | "vendor" },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      const result = await dispatch(registerUser(values));
      if (registerUser.fulfilled.match(result)) {
        toast.success("Account created successfully!");
        const role = result.payload.user.role;
        if (role === USER_ROLES.VENDOR) router.push(APP_ROUTES.VENDOR.SETTINGS);
        else                             router.push(APP_ROUTES.PRODUCTS);
      } else {
        toast.error(result.payload as string || "Registration failed");
      }
    },
  });

  const isVendor = formik.values.role === "vendor";

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-16">

      {/* Background dot grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, #cbd5e1 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          opacity: 0.5,
        }}
      />
      {/* Amber glow top */}
      <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-64 w-[480px] rounded-full bg-amber-300/25 blur-[80px]" />
      {/* Radial mask */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 65% 55% at 50% 0%, rgba(248,250,252,0) 0%, rgba(248,250,252,0.9) 80%, #f8fafc 100%)",
        }}
      />

      <div className="relative z-10 w-full max-w-md">

        {/* Logo + heading */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2.5 font-extrabold text-xl tracking-tight text-slate-900 mb-6">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 shadow-md shadow-amber-200">
              <Store className="h-4.5 w-4.5 text-white" />
            </span>
            VendorHub
          </Link>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Create your account</h1>
          <p className="mt-2 text-sm text-slate-500">Join thousands of vendors and customers</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-200 bg-white px-8 py-8 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)]">

          {/* Role selector */}
          <div className="mb-6 grid grid-cols-2 gap-3">
            {([
              {
                value: "customer",
                icon: ShoppingBag,
                label: "I want to shop",
                sub:   "Browse & buy products",
              },
              {
                value: "vendor",
                icon: Store,
                label: "I want to sell",
                sub:   "List & manage products",
              },
            ] as const).map(({ value, icon: Icon, label, sub }) => {
              const active = formik.values.role === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => formik.setFieldValue("role", value)}
                  className={`rounded-xl border-2 p-3.5 text-left transition-all duration-150 ${
                    active
                      ? "border-amber-400 bg-amber-50 shadow-sm shadow-amber-100"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className={`mb-1.5 inline-flex h-7 w-7 items-center justify-center rounded-lg ${active ? "bg-amber-500" : "bg-slate-100"} transition-colors duration-150`}>
                    <Icon className={`h-3.5 w-3.5 ${active ? "text-white" : "text-slate-500"}`} />
                  </div>
                  <p className={`text-sm font-bold leading-tight ${active ? "text-amber-700" : "text-slate-700"}`}>
                    {label}
                  </p>
                  <p className={`text-xs mt-0.5 ${active ? "text-amber-600/80" : "text-slate-400"}`}>
                    {sub}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Vendor approval notice */}
          {isVendor && (
            <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
              <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500 animate-pulse" />
              <p className="text-xs text-amber-700 leading-relaxed">
                Vendor stores require <span className="font-semibold">admin approval</span> before you can list products. Setup takes under 5 minutes.
              </p>
            </div>
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="John Doe"
              leftIcon={<User className="h-4 w-4" />}
              {...formik.getFieldProps("fullName")}
              error={formik.touched.fullName && formik.errors.fullName ? formik.errors.fullName : ""}
            />
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              leftIcon={<Mail className="h-4 w-4" />}
              {...formik.getFieldProps("email")}
              error={formik.touched.email && formik.errors.email ? formik.errors.email : ""}
            />
            <Input
              label="Password"
              type="password"
              placeholder="Min 6 chars, uppercase + number"
              leftIcon={<Lock className="h-4 w-4" />}
              {...formik.getFieldProps("password")}
              error={formik.touched.password && formik.errors.password ? formik.errors.password : ""}
            />

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={formik.isSubmitting}
              className="!bg-amber-500 hover:!bg-amber-600 !shadow-md !shadow-amber-200/70 !font-bold !rounded-xl transition-all duration-200 hover:!-translate-y-px"
            >
              {isVendor ? "Create Vendor Account" : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              href={APP_ROUTES.LOGIN}
              className="font-semibold text-amber-600 hover:text-amber-700 transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>

        {/* Bottom back link */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors"
          >
            <ArrowRight className="h-3 w-3 rotate-180" />
            Back to VendorHub
          </Link>
        </div>

      </div>
    </div>
  );
}