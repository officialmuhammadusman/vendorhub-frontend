"use client";
import Link from "next/link";
import { APP_ROUTES } from "@/constants";
import { Store, ShoppingBag, Code2, ArrowRight, CheckCircle2 } from "lucide-react";

const roles = [
  {
    icon: Store,
    audience: "For Vendors",
    headline: "Run your store your way",
    desc: "Set up a storefront, list products with up to 5 images, manage stock, track earnings with charts, and fulfill orders — all from your dashboard.",
    bullets: [
      "Custom store logo, banner & description",
      "Product discount pricing & tags",
      "Monthly earnings analytics (Recharts)",
      "Low stock alerts at ≤ 5 units",
      "Full order status management",
      "Public store page at /store/[vendorId]",
    ],
    cta: "Become a Vendor",
    href: APP_ROUTES.REGISTER,
    accent: "border-amber-200 bg-amber-50",
    iconBg: "bg-amber-500",
    ctaClass: "bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-200",
  },
  {
    icon: ShoppingBag,
    audience: "For Customers",
    headline: "Shop smarter, every time",
    desc: "Browse hundreds of products across all vendors, apply coupons, check out with Stripe, and track every order from purchase to doorstep.",
    bullets: [
      "Persistent cart across devices",
      "Full-text product search & filters",
      "Percentage & fixed discount coupons",
      "Secure Stripe checkout",
      "Real-time order tracking",
      "Verified purchase reviews only",
    ],
    cta: "Start Shopping",
    href: APP_ROUTES.PRODUCTS,
    accent: "border-slate-200 bg-white",
    iconBg: "bg-slate-800",
    ctaClass: "bg-slate-900 hover:bg-slate-800 text-white shadow-md shadow-slate-200",
  },
  {
    icon: Code2,
    audience: "For Developers & Admins",
    headline: "Full control, zero friction",
    desc: "Deploy a production-ready platform with 50+ documented Swagger endpoints, role-based auth, Stripe webhooks, and Cloudinary out of the box.",
    bullets: [
      "50+ OpenAPI / Swagger endpoints",
      "Role-based JWT middleware (3 roles)",
      "Stripe webhook signature verification",
      "MongoDB aggregation pipelines",
      "Cloudinary image management",
      "Express rate limiting & input validation",
    ],
    cta: "View the Docs",
    href: "http://localhost:8000/api/docs",
    accent: "border-slate-200 bg-white",
    iconBg: "bg-slate-700",
    ctaClass: "bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 shadow-sm",
  },
];

export function RolesSection() {
  return (
    <section id="for-vendors" className="bg-slate-50 py-24 sm:py-32 border-y border-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-3">
            Built for Everyone
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
            One platform,<br />three powerful roles
          </h2>
          <p className="text-slate-500 text-lg leading-relaxed">
            VendorHub is purpose-built for vendors who sell, customers who buy, and admins who run the show.
          </p>
        </div>

        {/* Role cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {roles.map(({ icon: Icon, audience, headline, desc, bullets, cta, href, accent, iconBg, ctaClass }) => (
            <div
              key={audience}
              className={`rounded-2xl border ${accent} p-8 flex flex-col shadow-sm hover:shadow-md transition-shadow duration-300`}
            >
              {/* Icon + label */}
              <div className="flex items-center gap-3 mb-6">
                <div className={`h-10 w-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  {audience}
                </span>
              </div>

              <h3 className="text-xl font-black text-slate-900 mb-3">{headline}</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-6">{desc}</p>

              {/* Bullet list */}
              <ul className="space-y-2.5 mb-8 flex-1">
                {bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <CheckCircle2 className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                    {b}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={href}
                className={`group inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition-all duration-200 hover:-translate-y-px active:translate-y-0 ${ctaClass}`}
              >
                {cta}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}