import { cn } from "@/utils";
import { Store } from "lucide-react";

export function Spinner({ size = "md", className }: { size?: "sm" | "md" | "lg"; className?: string }) {
  const sizes = { sm: "h-4 w-4", md: "h-8 w-8", lg: "h-10 w-10" };
  return (
    <svg
      className={cn("animate-spin text-amber-500", sizes[size], className)}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

export function PageLoader() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      {/* Icon + spinner stacked */}
      <div className="relative flex items-center justify-center">
        {/* Outer ring */}
        <div className="h-16 w-16 rounded-full border-2 border-slate-100 flex items-center justify-center">
          <Store className="h-6 w-6 text-slate-300" />
        </div>
        {/* Spinning ring on top */}
        <svg
          className="absolute inset-0 h-16 w-16 animate-spin text-amber-500"
          viewBox="0 0 64 64"
          fill="none"
        >
          <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="3" strokeLinecap="round"
            strokeDasharray="44 132"
          />
        </svg>
      </div>
      <p className="text-xs font-medium text-slate-400 tracking-widest uppercase animate-pulse">
        Loading…
      </p>
    </div>
  );
}