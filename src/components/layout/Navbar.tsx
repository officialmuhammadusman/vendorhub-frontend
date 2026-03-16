"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Menu, X, Store, LayoutDashboard, LogOut, User, Package, ChevronDown } from "lucide-react";
import { Button }         from "@/components/ui/Button";
import { Avatar }         from "@/components/ui/Avatar";
import { useAuth }        from "@/hooks/useAuth";
import { useCart }        from "@/hooks/useCart";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { toggleCart, toggleMobileMenu } from "@/store/slices/uiSlice";
import { APP_ROUTES } from "@/constants";

export function Navbar() {
  const router   = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuth, isVendor, isAdmin, handleLogout } = useAuth();
  const { itemCount } = useCart();
  const { isMobileMenuOpen } = useAppSelector((s) => s.ui);

  const onLogout = async () => {
    await handleLogout();
    router.push(APP_ROUTES.LOGIN);
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-[0_1px_0_0_#f1f5f9]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          href={APP_ROUTES.HOME}
          className="flex items-center gap-2.5 font-extrabold text-xl tracking-tight text-slate-900 hover:opacity-90 transition-opacity"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 shadow-sm shadow-amber-200">
            <Store className="h-4 w-4 text-white" />
          </span>
          VendorHub
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-1 md:flex">
          {isVendor && (
            <Link
              href={APP_ROUTES.VENDOR.DASHBOARD}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors duration-150"
            >
              Dashboard
            </Link>
          )}
          {isAdmin && (
            <Link
              href={APP_ROUTES.ADMIN.DASHBOARD}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors duration-150"
            >
              Admin
            </Link>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">

          {/* Cart button */}
          {isAuth && !isAdmin && (
            <button
              onClick={() => dispatch(toggleCart())}
              className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors duration-150"
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-black text-white shadow-sm">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </button>
          )}

          {/* User menu */}
          {isAuth ? (
            <div className="relative group">
              <button className="flex items-center gap-2 rounded-xl border border-transparent px-2.5 py-1.5 hover:border-slate-200 hover:bg-slate-50 transition-all duration-150">
                <Avatar src={user?.avatar?.url} name={user?.fullName} size="sm" />
                <span className="hidden text-sm font-semibold text-slate-700 sm:block">
                  {user?.fullName?.split(" ")[0]}
                </span>
                <ChevronDown className="hidden h-3.5 w-3.5 text-slate-400 sm:block" />
              </button>

              {/* Dropdown */}
              <div className="absolute right-0 top-full mt-2 hidden w-52 rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-900/8 group-hover:block">
                {/* User info header */}
                <div className="border-b border-slate-100 px-4 py-3">
                  <p className="text-sm font-bold text-slate-900 truncate">{user?.fullName}</p>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">{user?.email}</p>
                </div>

                <div className="p-1.5">
                  <Link
                    href={APP_ROUTES.PROFILE}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors duration-100"
                  >
                    <User className="h-4 w-4 text-slate-400" />
                    Profile
                  </Link>
                  {!isAdmin && (
                    <Link
                      href={APP_ROUTES.ORDERS}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors duration-100"
                    >
                      <Package className="h-4 w-4 text-slate-400" />
                      My Orders
                    </Link>
                  )}
                  {isVendor && (
                    <Link
                      href={APP_ROUTES.VENDOR.DASHBOARD}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors duration-100"
                    >
                      <LayoutDashboard className="h-4 w-4 text-slate-400" />
                      Dashboard
                    </Link>
                  )}

                  <div className="my-1 border-t border-slate-100" />

                  <button
                    onClick={onLogout}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-100"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <button
                onClick={() => router.push(APP_ROUTES.LOGIN)}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors duration-150"
              >
                Login
              </button>
              <button
                onClick={() => router.push(APP_ROUTES.REGISTER)}
                className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-white shadow-sm shadow-amber-200 hover:bg-amber-600 transition-all duration-150 hover:-translate-y-px active:translate-y-0"
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100 transition-colors duration-150"
            onClick={() => dispatch(toggleMobileMenu())}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-slate-100 bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
          {isVendor && (
              <Link
                href={APP_ROUTES.VENDOR.DASHBOARD}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Dashboard
              </Link>
            )}
            {isAdmin && (
              <Link
                href={APP_ROUTES.ADMIN.DASHBOARD}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Admin
              </Link>
            )}
            {!isAuth && (
              <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-slate-100">
                <Link
                  href={APP_ROUTES.LOGIN}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href={APP_ROUTES.REGISTER}
                  className="rounded-lg bg-amber-500 px-4 py-2.5 text-center text-sm font-bold text-white hover:bg-amber-600 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}