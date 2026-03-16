"use client";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Marcus T.",
    role: "Electronics Vendor",
    initials: "MT",
    color: "bg-amber-500",
    text: "My store was approved the same day I registered. Had my first sale within hours. The dashboard analytics and earnings chart are exactly what I needed to grow.",
    stars: 5,
  },
  {
    name: "Priya S.",
    role: "Fashion Store Owner",
    initials: "PS",
    color: "bg-rose-500",
    text: "Multi-image upload and discount pricing are brilliant. My customers love how easy it is to shop across different vendors all in one place.",
    stars: 5,
  },
  {
    name: "James R.",
    role: "Regular Customer",
    initials: "JR",
    color: "bg-blue-500",
    text: "Cart saved when I switched from my phone to laptop. Applied a coupon, paid via Stripe, tracked the order live. Smooth from start to delivery.",
    stars: 5,
  },
  {
    name: "Amira K.",
    role: "Accessories Vendor",
    initials: "AK",
    color: "bg-green-600",
    text: "Low stock alerts have saved me from overselling multiple times. Order management is straightforward, and customers always know exactly where their parcel is.",
    stars: 5,
  },
  {
    name: "Daniel O.",
    role: "Senior Developer",
    initials: "DO",
    color: "bg-slate-700",
    text: "The JWT refresh queue pattern, Stripe webhook handling, and MongoDB aggregations are all done right. Genuinely impressive codebase to ship from.",
    stars: 5,
  },
  {
    name: "Sofia M.",
    role: "Frequent Shopper",
    initials: "SM",
    color: "bg-purple-500",
    text: "Verified-purchase-only reviews means I can actually trust the ratings. Full-text search makes finding what I want so much faster than other marketplaces.",
    stars: 5,
  },
];

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5 mb-3">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="bg-white py-24 sm:py-32 border-t border-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-3">
            What People Say
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Loved by vendors,<br />customers & developers
          </h2>
        </div>

        {/* Masonry columns */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5">
          {testimonials.map(({ name, role, initials, color, text, stars }) => (
            <div
              key={name}
              className="break-inside-avoid mb-5 rounded-2xl border border-slate-100 bg-slate-50 p-6 hover:border-amber-200 hover:bg-amber-50/30 transition-all duration-200"
            >
              <StarRow count={stars} />
              <p className="text-sm text-slate-700 leading-relaxed mb-5">"{text}"</p>
              <div className="flex items-center gap-3">
                <div className={`h-9 w-9 rounded-full ${color} flex items-center justify-center text-xs font-black text-white shrink-0`}>
                  {initials}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">{name}</div>
                  <div className="text-xs text-slate-500">{role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}