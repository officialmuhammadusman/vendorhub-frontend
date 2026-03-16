import Link from "next/link";
import { Store } from "lucide-react";
import { APP_ROUTES } from "@/constants";

const footerLinks = {
  Shop: [
    { label: "All Products",      href: APP_ROUTES.PRODUCTS },
    { label: "My Orders",         href: APP_ROUTES.ORDERS   },
    { label: "My Profile",        href: APP_ROUTES.PROFILE  },
  ],
  Sell: [
    { label: "Become a Vendor",   href: APP_ROUTES.REGISTER          },
    { label: "Vendor Dashboard",  href: APP_ROUTES.VENDOR.DASHBOARD  },
    { label: "Manage Products",   href: APP_ROUTES.VENDOR.PRODUCTS   },
    { label: "View Earnings",     href: APP_ROUTES.VENDOR.EARNINGS   },
  ],
  Account: [
    { label: "Login",             href: APP_ROUTES.LOGIN    },
    { label: "Register",          href: APP_ROUTES.REGISTER },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 pb-8">

        {/* Top grid */}
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 mb-12">

          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 font-extrabold text-lg tracking-tight text-slate-900 mb-3"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 shadow-sm shadow-amber-200">
                <Store className="h-4 w-4 text-white" />
              </span>
              VendorHub
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed max-w-[200px]">
              A complete multi-vendor marketplace — buy, sell, and manage everything in one place.
            </p>
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

        {/* Bottom bar */}
        <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} VendorHub. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span>Built with Next.js 15 + Stripe</span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span>v1.0.0</span>
          </div>
        </div>

      </div>
    </footer>
  );
}