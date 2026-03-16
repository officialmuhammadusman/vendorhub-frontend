import Link from "next/link";
import { Store } from "lucide-react";
import { APP_ROUTES } from "@/constants";

const footerLinks = {
  Platform: [
    { label: "Browse Products",   href: APP_ROUTES.PRODUCTS           },
    { label: "Vendor Dashboard",  href: APP_ROUTES.VENDOR.DASHBOARD   },
    { label: "Admin Panel",       href: APP_ROUTES.ADMIN.DASHBOARD    },
    { label: "API Docs",          href: "http://localhost:8000/api/docs" },
  ],
  Vendors: [
    { label: "Become a Vendor",   href: APP_ROUTES.REGISTER           },
    { label: "Store Setup Guide", href: APP_ROUTES.REGISTER           },
    { label: "Product Listings",  href: APP_ROUTES.VENDOR.DASHBOARD   },
    { label: "Earnings Analytics",href: APP_ROUTES.VENDOR.DASHBOARD   },
  ],
  Customers: [
    { label: "Shop Now",          href: APP_ROUTES.PRODUCTS           },
    { label: "My Orders",         href: APP_ROUTES.ORDERS             },
    { label: "My Profile",        href: APP_ROUTES.PROFILE            },
    { label: "Apply Coupons",     href: APP_ROUTES.PRODUCTS           },
  ],
  Account: [
    { label: "Register",          href: APP_ROUTES.REGISTER           },
    { label: "Login",             href: APP_ROUTES.LOGIN              },
    { label: "Change Password",   href: APP_ROUTES.PROFILE            },
    { label: "Update Profile",    href: APP_ROUTES.PROFILE            },
  ],
};

export function LandingFooter() {
  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-10">

        {/* Top — brand + link columns */}
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-5 mb-14">

          {/* Brand column */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5 font-extrabold text-lg text-slate-900 mb-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 shadow-sm shadow-amber-200">
                <Store className="h-4 w-4 text-white" />
              </span>
              VendorHub
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              A complete, production-ready multi-vendor marketplace platform. Built with Next.js 15, Node.js, MongoDB, and Stripe.
            </p>
            {/* Stack badges */}
            <div className="flex flex-wrap gap-2 mt-5">
              {["Next.js", "Stripe", "MongoDB"].map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[10px] font-semibold text-slate-500"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-4">
                {group}
              </h4>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-slate-500 hover:text-amber-600 transition-colors duration-150"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100 pt-7 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} VendorHub. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-slate-400">
            <span>v1.0.0</span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span>50+ API Endpoints</span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span>3 User Roles</span>
          </div>
        </div>

      </div>
    </footer>
  );
}