import { cn } from "@/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?:    string;
  error?:    string;
  helper?:   string;
  leftIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helper, leftIcon, className, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-all duration-150 placeholder:text-slate-400",
            "focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20",
            error && "border-red-400 focus:border-red-500 focus:ring-red-500/20",
            leftIcon && "pl-10",
            className
          )}
          {...props}
        />
      </div>
      {error  && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
      {helper && !error && <p className="mt-1.5 text-xs text-slate-400">{helper}</p>}
    </div>
  )
);
Input.displayName = "Input";