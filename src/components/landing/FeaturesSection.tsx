"use client";
import {
  ShoppingCart, Store, LayoutDashboard, Shield,
  CreditCard, Star, Tag, Package, BarChart3,
  RefreshCcw, Lock, Search,
} from "lucide-react";

const features = [
  {
    icon: Store,
    title: "Multi-Vendor Storefronts",
    desc: "Every vendor gets a public store page with logo, banner, stats, and all active products. No login needed to browse.",
  },
  {
    icon: LayoutDashboard,
    title: "Vendor Dashboard",
    desc: "Real-time earnings, monthly revenue charts, low stock alerts, and full order management in one clean view.",
  },
  {
    icon: CreditCard,
    title: "Stripe Payments & Refunds",
    desc: "PaymentIntents, webhook verification, and automatic refunds on cancellation. Test with card 4242 4242 4242 4242.",
  },
  {
    icon: ShoppingCart,
    title: "Persistent Smart Cart",
    desc: "Cart syncs across devices. Mongoose virtuals compute subtotals on the fly — no stale totals ever.",
  },
  {
    icon: Tag,
    title: "Coupon Engine",
    desc: "Admin creates percentage or fixed coupons with per-user limits, expiry dates, usage caps, and minimum order amounts.",
  },
  {
    icon: Package,
    title: "Full Order Lifecycle",
    desc: "Pending → Confirmed → Shipped → Delivered, enforced server-side. Customers can cancel and get instant refunds.",
  },
  {
    icon: Star,
    title: "Verified Purchase Reviews",
    desc: "Only delivered, paid orders can leave reviews. Mongoose hooks auto-recalculate product ratings on every save/delete.",
  },
  {
    icon: Shield,
    title: "Admin Control Panel",
    desc: "Full platform visibility — approve/suspend vendors, ban users, manage all products, orders, and coupons.",
  },
  {
    icon: BarChart3,
    title: "Earnings Analytics",
    desc: "Month-by-month revenue breakdowns formatted for Recharts AreaChart. Lifetime totals and order counts always fresh.",
  },
  {
    icon: RefreshCcw,
    title: "Silent Token Refresh",
    desc: "Axios interceptor queues all 401 requests, fires ONE refresh call, then retries everything — users never get logged out mid-session.",
  },
  {
    icon: Lock,
    title: "JWT Dual-Token Auth",
    desc: "15-min access tokens + 7-day refresh tokens in httpOnly cookies. bcrypt (12 rounds), rate limiting, role-based guards.",
  },
  {
    icon: Search,
    title: "Advanced Product Search",
    desc: "MongoDB full-text index on title, description, and tags. Filter by category, price range, and sort by rating or sales.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-3">
            Platform Features
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Everything built in.
            <br />Nothing to bolt on.
          </h2>
          <p className="text-slate-500 text-lg leading-relaxed">
            VendorHub ships with every feature a marketplace needs — auth, payments, reviews, analytics, and a full admin panel — ready to go.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-100 rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={title}
              className="group bg-white p-7 hover:bg-amber-50/40 transition-colors duration-200"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 border border-amber-100 group-hover:bg-amber-100 group-hover:border-amber-200 transition-colors duration-200">
                <Icon className="h-5 w-5 text-amber-600" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                {title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}