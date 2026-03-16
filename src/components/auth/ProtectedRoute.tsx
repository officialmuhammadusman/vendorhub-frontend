"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth }   from "@/hooks/useAuth";
import { PageLoader } from "@/components/ui/Spinner";
import { APP_ROUTES, USER_ROLES } from "@/constants";

interface ProtectedRouteProps {
  children:     React.ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuth, isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuth)  { router.replace(APP_ROUTES.LOGIN); return; }
    if (!isLoading && isAuth && allowedRoles && user && !allowedRoles.includes(user.role)) {
      router.replace(APP_ROUTES.HOME);
    }
  }, [isAuth, isLoading, user, allowedRoles, router]);

  if (isLoading) return <PageLoader />;
  if (!isAuth)   return null;
  if (allowedRoles && user && !allowedRoles.includes(user.role)) return null;

  return <>{children}</>;
}
