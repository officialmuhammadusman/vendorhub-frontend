"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Store, Menu, X } from "lucide-react";
import { APP_ROUTES } from "@/constants";

const navLinks = [
  { label: "Features",     href: "#features"            },
  { label: "How It Works", href: "#how-it-works"        },
  { label: "For Vendors",  href: "#for-vendors"         },
  { label: "Products",     href: APP_ROUTES.PRODUCTS, isRoute: true },
];

export function LandingNavbar() {
  const router            = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-[0_1px_0_0_#e5e7eb]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-extrabold text-xl tracking-tight text-slate-900"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 shadow-md shadow-amber-200">
            <Store className="h-4 w-4 text-white" />
          </span>
          VendorHub
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map(({ label, href, isRoute }) =>
            isRoute ? (
              <Link
                key={label}
                href={href}
                className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors duration-150"
              >
                {label}
              </Link>
            ) : (
              <a
                key={label}
                href={href}
                className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors duration-150"
              >
                {label}
              </a>
            )
          )}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={() => router.push(APP_ROUTES.LOGIN)}
            className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors px-3 py-2 rounded-lg hover:bg-slate-100"
          >
            Log in
          </button>
          <button
            onClick={() => router.push(APP_ROUTES.REGISTER)}
            className="rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-amber-200/60 hover:bg-amber-600 transition-all duration-200 hover:-translate-y-px active:translate-y-0"
          >
            Get Started Free
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100 transition-colors"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-slate-100 bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1 mb-4">
            {navLinks.map(({ label, href, isRoute }) =>
              isRoute ? (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  {label}
                </Link>
              ) : (
                <a
                  key={label}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  {label}
                </a>
              )
            )}
          </nav>
          <div className="flex flex-col gap-2 border-t border-slate-100 pt-4">
            <Link
              href={APP_ROUTES.LOGIN}
              className="rounded-lg border border-slate-200 px-4 py-2.5 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Log in
            </Link>
            <Link
              href={APP_ROUTES.REGISTER}
              className="rounded-lg bg-amber-500 px-4 py-2.5 text-center text-sm font-bold text-white hover:bg-amber-600 transition-colors"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}