import { cn } from "@/utils";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title:      string;
  value:      string | number;
  icon:       LucideIcon;
  trend?:     string;
  positive?:  boolean;
  className?: string;
}

export function StatsCard({ title, value, icon: Icon, trend, positive, className }: StatsCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200",
        className
      )}
    >
      {/* Subtle top accent line */}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-amber-400 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex items-start justify-between gap-4">
        {/* Text */}
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-widest text-slate-400 mb-2">
            {title}
          </p>
          <p className="text-2xl font-bold text-slate-800 leading-none tracking-tight">
            {value}
          </p>

          {trend && (
            <div className={cn(
              "mt-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
              positive
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-600"
            )}>
              {positive
                ? <TrendingUp className="h-3 w-3" />
                : <TrendingDown className="h-3 w-3" />
              }
              {trend}
            </div>
          )}
        </div>

        {/* Icon */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 border border-amber-100 group-hover:bg-amber-100 group-hover:border-amber-200 transition-colors duration-200">
          <Icon className="h-5 w-5 text-amber-600" />
        </div>
      </div>
    </div>
  );
}