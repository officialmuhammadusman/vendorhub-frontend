"use client";
import { UserPlus, Store, ShoppingCart, BarChart3 } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Register your account",
    desc: "Sign up in seconds. Choose your role — Customer, Vendor, or Admin. Email + password, JWT issued instantly.",
    note: "Roles: Customer · Vendor · Admin",
  },
  {
    number: "02",
    icon: Store,
    title: "Set up your store",
    desc: "Vendors configure their storefront: store name, logo, banner, description, and bank details. Admin reviews and approves.",
    note: "Approval flow: Pending → Approved",
  },
  {
    number: "03",
    icon: ShoppingCart,
    title: "List products & sell",
    desc: "Add products with up to 5 images, discount pricing, categories, and tags. Customers shop, apply coupons, and pay via Stripe.",
    note: "Powered by Cloudinary + Stripe",
  },
  {
    number: "04",
    icon: BarChart3,
    title: "Track orders & grow",
    desc: "Follow every order from Pending to Delivered. Vendors see monthly earnings charts. Admins monitor the full platform.",
    note: "Analytics via Recharts AreaChart",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-3">
            How It Works
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
            From signup to<br />first sale in minutes
          </h2>
          <p className="text-slate-500 text-lg leading-relaxed">
            VendorHub is designed to get you up and running fast — no complex configuration, no hidden steps.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line — desktop */}
          <div
            aria-hidden
            className="absolute top-12 left-0 right-0 hidden h-px lg:block"
            style={{
              background: "repeating-linear-gradient(90deg, #e2e8f0 0, #e2e8f0 6px, transparent 6px, transparent 14px)",
              marginLeft: "12.5%",
              marginRight: "12.5%",
            }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {steps.map(({ number, icon: Icon, title, desc, note }) => (
              <div key={number} className="relative flex flex-col items-center text-center group">

                {/* Step circle */}
                <div className="relative z-10 flex h-24 w-24 flex-col items-center justify-center rounded-full border-2 border-slate-100 bg-white shadow-md shadow-slate-100 mb-6 group-hover:border-amber-200 group-hover:shadow-amber-100 transition-all duration-300">
                  <Icon className="h-7 w-7 text-amber-500 mb-0.5" />
                  <span className="text-[10px] font-black text-slate-300 tracking-widest">{number}</span>
                </div>

                <h3 className="text-base font-black text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-3">{desc}</p>
                <span className="inline-block rounded-full bg-amber-50 border border-amber-100 px-3 py-1 text-[10px] font-bold text-amber-600 uppercase tracking-wide">
                  {note}
                </span>

              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}