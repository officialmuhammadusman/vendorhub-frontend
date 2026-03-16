"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { loginSchema } from "@/validations/authSchema";
import { Input }   from "@/components/ui/Input";
import { Button }  from "@/components/ui/Button";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { loginUser }      from "@/store/slices/authSlice";
import { useToast }       from "@/hooks/useToast";
import { useAuth }        from "@/hooks/useAuth";
import { APP_ROUTES, USER_ROLES } from "@/constants";
import { Store, Mail, Lock, ArrowRight } from "lucide-react";
import { useEffect } from "react";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router   = useRouter();
  const toast    = useToast();
  const { isAuth, user } = useAuth();

  useEffect(() => {
    if (isAuth && user) {
      if (user.role === USER_ROLES.ADMIN)        router.replace(APP_ROUTES.ADMIN.DASHBOARD);
      else if (user.role === USER_ROLES.VENDOR)  router.replace(APP_ROUTES.VENDOR.DASHBOARD);
      else                                        router.replace(APP_ROUTES.PRODUCTS);
    }
  }, [isAuth, user, router]);

  const formik = useFormik({
    initialValues:    { email: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      const result = await dispatch(loginUser(values));
      if (loginUser.fulfilled.match(result)) {
        toast.success("Welcome back!");
        const role = result.payload.user.role;
        if (role === USER_ROLES.ADMIN)        router.push(APP_ROUTES.ADMIN.DASHBOARD);
        else if (role === USER_ROLES.VENDOR)  router.push(APP_ROUTES.VENDOR.DASHBOARD);
        else                                   router.push(APP_ROUTES.PRODUCTS);
      } else {
        toast.error(result.payload as string || "Login failed");
      }
    },
  });

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
      {/* Radial mask so dots fade toward edges */}
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
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-500">Sign in to your VendorHub account</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-200 bg-white px-8 py-8 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)]">
          <form onSubmit={formik.handleSubmit} className="space-y-4">
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
              placeholder="••••••••"
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
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link
              href={APP_ROUTES.REGISTER}
              className="font-semibold text-amber-600 hover:text-amber-700 transition-colors"
            >
              Create one free
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