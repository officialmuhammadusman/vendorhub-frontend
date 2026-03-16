"use client";
import Link from "next/link";
import { APP_ROUTES } from "@/constants";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="bg-slate-50 border-t border-slate-100 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-8 py-16 sm:px-16 sm:py-20 text-center shadow-2xl">

          {/* Background decoration */}
          <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-[600px] rounded-full bg-amber-500/20 blur-[80px]" />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          <div className="relative z-10 mx-auto max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-4">
              Get Started Today
            </p>
            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-6 leading-tight">
              Ready to launch your<br />marketplace?
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-10">
              Register in under a minute. Vendors can start listing products today. Customers can shop immediately. Admins have full control from day one.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={APP_ROUTES.REGISTER}
                className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-amber-500 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-amber-900/40 hover:bg-amber-400 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
              >
                Create Free Account
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href={APP_ROUTES.PRODUCTS}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-8 py-4 text-sm font-bold text-slate-300 hover:border-slate-600 hover:text-white hover:bg-slate-700 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
              >
                Browse Products
              </Link>
            </div>

            {/* Bottom micro-copy */}
            <p className="mt-8 text-xs text-slate-600">
              No credit card required · 3 roles · 50+ API endpoints · Stripe + MongoDB + Next.js 15
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}