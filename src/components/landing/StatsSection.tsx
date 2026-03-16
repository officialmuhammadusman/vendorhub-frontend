"use client";

const stats = [
  { value: "50+",  label: "API Endpoints",      sub: "Fully Swagger documented" },
  { value: "7",    label: "Database Models",    sub: "MongoDB + Mongoose"        },
  { value: "3",    label: "User Roles",         sub: "Customer, Vendor, Admin"   },
  { value: "88",   label: "Source Files",       sub: "TypeScript throughout"     },
  { value: "12K+", label: "Products Ready",     sub: "Across all vendors"        },
  { value: "98%",  label: "Customer Satisfaction", sub: "Based on reviews"       },
];

export function StatsSection() {
  return (
    <section className="bg-slate-900 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-slate-700/30 rounded-2xl overflow-hidden">
          {stats.map(({ value, label, sub }) => (
            <div key={label} className="bg-slate-900 p-7 text-center hover:bg-slate-800/60 transition-colors duration-200 group">
              <div className="text-3xl font-black text-white mb-1 group-hover:text-amber-400 transition-colors duration-200">
                {value}
              </div>
              <div className="text-xs font-bold text-slate-300 mb-1">{label}</div>
              <div className="text-[10px] text-slate-600">{sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}