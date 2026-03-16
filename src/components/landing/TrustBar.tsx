"use client";

const techPills = [
  "Next.js 15",
  "Node.js + Express",
  "MongoDB + Mongoose",
  "Stripe Payments",
  "Cloudinary",
  "Redux Toolkit",
  "JWT Auth",
  "Swagger Docs",
];

export function TrustBar() {
  return (
    <section className="border-y border-slate-100 bg-slate-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-400 mb-6">
          Built on a production-grade stack
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {techPills.map((t) => (
            <span
              key={t}
              className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-600 shadow-sm"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}