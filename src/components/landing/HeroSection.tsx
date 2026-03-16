"use client";
import Link from "next/link";
import { APP_ROUTES } from "@/constants";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const proof = [
  "No credit card required",
  "Setup in under 5 minutes",
  "50+ REST API endpoints",
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white pt-32 pb-20 sm:pt-40 sm:pb-28">

      {/* Subtle grid background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, #f1f5f9 1px, transparent 1px), linear-gradient(to bottom, #f1f5f9 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      {/* Top amber glow */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-amber-100/70 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Centered hero text */}
        <div className="mx-auto max-w-3xl text-center">

          {/* Eyebrow pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-xs font-semibold text-amber-700 mb-8 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            Multi-Vendor E-Commerce Platform · v1.0
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.05] tracking-tight mb-6">
            Launch your own
            <br />
            <span className="relative whitespace-nowrap">
              <svg
                aria-hidden="true"
                viewBox="0 0 418 42"
                className="absolute left-0 top-full -mt-1 w-full fill-amber-300/60"
                preserveAspectRatio="none"
              >
                <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 11.ol-2.811 1.07-3.853 1.51-3.486 2.01.38.513 1.034.401 14.728-1.04 36.548-3.826 81.199-4.807 119.587-2.686 14.484.81 15.717.993 15.788 1.945.062.826-1.168 1.056-3.69 1.3l-13.19 1.267c-5.65.545-7.41 1.222-7.41 2.508 0 1.283 2.105 1.42 15.46.892 10.413-.408 14.792-.153 15.02.782.2.797-1.768 1.478-4.733 1.643-11.142.622-6.676 2.776 5.82 2.791 12.596.017 15.476.48 15.557 3.07.14 4.356-51.788 8.874-131.83 11.405-20.422.645-58.23.855-87.4.503z" />
              </svg>
              <span className="relative text-amber-500">marketplace</span>
            </span>
            {" "}platform
          </h1>

          <p className="text-lg sm:text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto mb-10">
            VendorHub is a complete, production-ready marketplace where vendors sell, customers buy, and admins control everything — backed by Stripe, MongoDB, and Next.js 15.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <Link
              href={APP_ROUTES.REGISTER}
              className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-amber-500 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-amber-200 hover:bg-amber-600 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
            >
              Start for Free
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href={APP_ROUTES.PRODUCTS}
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-8 py-4 text-sm font-bold text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
            >
              Browse Products
            </Link>
          </div>

          {/* Social proof bullets */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {proof.map((p) => (
              <span key={p} className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                {p}
              </span>
            ))}
          </div>
        </div>

        {/* Dashboard preview image / mockup */}
        <div className="relative mx-auto mt-20 max-w-5xl">
          {/* Glow behind the card */}
          <div className="absolute inset-x-20 -top-4 h-12 bg-amber-400/30 blur-2xl rounded-full" />

          {/* Browser chrome mockup */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_20px_60px_-10px_rgba(0,0,0,0.12)] overflow-hidden">
            {/* Browser top bar */}
            <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-amber-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
              </div>
              <div className="mx-auto flex h-6 w-64 items-center rounded-md bg-white border border-slate-200 px-3">
                <span className="text-[11px] text-slate-400 truncate">localhost:3000/vendor/dashboard</span>
              </div>
            </div>

            {/* Dashboard UI mockup */}
            <div className="bg-slate-50 p-5 min-h-[340px]">
              <div className="grid grid-cols-12 gap-4 h-full">

                {/* Sidebar */}
                <div className="col-span-2 rounded-xl bg-white border border-slate-100 shadow-sm p-3 hidden sm:block">
                  <div className="h-7 w-7 rounded-lg bg-amber-500 mb-4" />
                  {[80, 60, 70, 55, 65].map((w, i) => (
                    <div key={i} className={`mb-2.5 h-2.5 rounded-full bg-slate-100`} style={{ width: `${w}%` }} />
                  ))}
                  <div className="mt-4 h-2.5 w-3/4 rounded-full bg-amber-100" />
                  <div className="mt-2 h-2.5 w-1/2 rounded-full bg-slate-100" />
                </div>

                {/* Main content */}
                <div className="col-span-12 sm:col-span-10 space-y-4">

                  {/* Stat cards row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: "Revenue",  val: "$24,580", color: "text-slate-900", sub: "+12% this month", accent: "bg-amber-50 border-amber-100" },
                      { label: "Orders",   val: "348",     color: "text-slate-900", sub: "18 pending",      accent: "bg-slate-50 border-slate-100" },
                      { label: "Products", val: "56",      color: "text-slate-900", sub: "3 low stock",     accent: "bg-slate-50 border-slate-100" },
                      { label: "Rating",   val: "4.8 ★",   color: "text-amber-600", sub: "128 reviews",    accent: "bg-slate-50 border-slate-100" },
                    ].map(({ label, val, color, sub, accent }) => (
                      <div key={label} className={`rounded-xl border ${accent} p-3`}>
                        <div className="text-[10px] text-slate-400 font-medium mb-1">{label}</div>
                        <div className={`text-base font-black ${color}`}>{val}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{sub}</div>
                      </div>
                    ))}
                  </div>

                  {/* Chart area + orders table */}
                  <div className="grid grid-cols-5 gap-3">
                    {/* Chart */}
                    <div className="col-span-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                      <div className="flex justify-between items-center mb-3">
                        <div className="h-2.5 w-24 rounded-full bg-slate-100" />
                        <div className="h-2 w-16 rounded-full bg-slate-100" />
                      </div>
                      <div className="flex items-end gap-1.5 h-20">
                        {[35, 55, 40, 70, 50, 85, 60, 90, 65, 80, 72, 100].map((h, i) => (
                          <div
                            key={i}
                            className="flex-1 rounded-t-sm"
                            style={{
                              height: `${h}%`,
                              background: i === 11
                                ? "#f59e0b"
                                : i > 8
                                ? "#fcd34d"
                                : "#fef3c7",
                            }}
                          />
                        ))}
                      </div>
                      <div className="flex justify-between mt-2">
                        {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m) => (
                          <div key={m} className="text-[8px] text-slate-300">{m}</div>
                        ))}
                      </div>
                    </div>

                    {/* Recent orders */}
                    <div className="col-span-2 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                      <div className="h-2.5 w-20 rounded-full bg-slate-100 mb-3" />
                      {[
                        { id: "#4821", status: "Delivered",  color: "bg-green-100 text-green-700" },
                        { id: "#4820", status: "Shipped",    color: "bg-blue-100 text-blue-700"   },
                        { id: "#4819", status: "Confirmed",  color: "bg-amber-100 text-amber-700" },
                        { id: "#4818", status: "Pending",    color: "bg-slate-100 text-slate-600" },
                      ].map(({ id, status, color }) => (
                        <div key={id} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                          <span className="text-[11px] font-semibold text-slate-600">{id}</span>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${color}`}>{status}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

          {/* Bottom fade on mockup */}
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent rounded-b-2xl" />
        </div>
      </div>
    </section>
  );
}