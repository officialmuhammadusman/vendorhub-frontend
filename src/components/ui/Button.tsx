import { cn } from "@/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:  "primary" | "secondary" | "danger" | "ghost" | "outline";
  size?:     "sm" | "md" | "lg";
  loading?:  boolean;
  fullWidth?: boolean;
}

const variants = {
  primary:   "bg-amber-500 text-white hover:bg-amber-600 disabled:bg-amber-300 shadow-sm shadow-amber-200",
  secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:bg-slate-100",
  danger:    "bg-red-500 text-white hover:bg-red-600 disabled:bg-red-300",
  ghost:     "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
  outline:   "border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, fullWidth, className, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {loading && (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  )
);
Button.displayName = "Button";