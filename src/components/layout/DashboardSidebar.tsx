"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils";
import { APP_ROUTES } from "@/constants";
import {
  Store, LayoutDashboard, Package, ShoppingBag,
  TrendingUp, Settings, Users, Tag, BarChart2,
  ArrowUpRight,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const vendorLinks = [
  { label: "Dashboard", href: APP_ROUTES.VENDOR.DASHBOARD, icon: LayoutDashboard },
  { label: "Products",  href: APP_ROUTES.VENDOR.PRODUCTS,  icon: Package         },
  { label: "Orders",    href: APP_ROUTES.VENDOR.ORDERS,    icon: ShoppingBag     },
  { label: "Earnings",  href: APP_ROUTES.VENDOR.EARNINGS,  icon: TrendingUp      },
  { label: "Settings",  href: APP_ROUTES.VENDOR.SETTINGS,  icon: Settings        },
];

const adminLinks = [
  { label: "Dashboard", href: APP_ROUTES.ADMIN.DASHBOARD, icon: BarChart2   },
  { label: "Users",     href: APP_ROUTES.ADMIN.USERS,     icon: Users       },
  { label: "Vendors",   href: APP_ROUTES.ADMIN.VENDORS,   icon: Store       },
  { label: "Products",  href: APP_ROUTES.ADMIN.PRODUCTS,  icon: Package     },
  { label: "Orders",    href: APP_ROUTES.ADMIN.ORDERS,    icon: ShoppingBag },
  { label: "Coupons",   href: APP_ROUTES.ADMIN.COUPONS,   icon: Tag         },
];

export function DashboardSidebar() {
  const pathname          = usePathname();
  const { isAdmin, user } = useAuth();
  const links     = isAdmin ? adminLinks : vendorLinks;
  const roleLabel = isAdmin ? "Admin Panel" : "Vendor Panel";

  return (
    <aside className="w-60 flex-shrink-0 border-r border-slate-200 bg-white min-h-screen flex flex-col">

      {/* ── Logo ── */}
      <div className="px-5 py-5 border-b border-slate-100">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-extrabold text-base tracking-tight text-slate-900"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 shadow-sm shadow-amber-200 shrink-0">
            <Store className="h-4 w-4 text-white" />
          </span>
          VendorHub
        </Link>
      </div>

      {/* ── User strip ── */}
      <div className="px-4 py-3.5 border-b border-slate-100 bg-slate-50/60">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0">
            <span className="text-xs font-semibold text-amber-700">
              {user?.fullName?.charAt(0).toUpperCase() ?? "U"}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate leading-tight">
              {user?.fullName ?? "—"}
            </p>
            <p className="text-[10px] font-medium text-amber-600 uppercase tracking-widest">
              {roleLabel}
            </p>
          </div>
        </div>
      </div>

      {/* ── Nav links ── */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {links.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-150",
                active
                  ? "bg-amber-50 text-amber-700 font-semibold shadow-[inset_0_0_0_1px_#fde68a]"
                  : "font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              )}
            >
              <span className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors duration-150",
                active
                  ? "bg-amber-100 text-amber-600"
                  : "bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-600"
              )}>
                <Icon className="h-3.5 w-3.5" />
              </span>

              {label}

              {active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Back to store ── */}
      <div className="px-3 pb-4 pt-2 border-t border-slate-100">
        <Link
          href={APP_ROUTES.PRODUCTS}
          className="group flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-medium text-slate-500 hover:border-amber-200 hover:bg-amber-50 hover:text-amber-700 transition-all duration-150"
        >
          <div className="flex items-center gap-2">
            <Store className="h-3.5 w-3.5" />
            Back to Store
          </div>
          <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
        </Link>
      </div>

    </aside>
  );
}