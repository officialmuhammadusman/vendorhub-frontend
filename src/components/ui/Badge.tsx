import { cn } from "@/utils";

interface BadgeProps {
  children:   React.ReactNode;
  className?: string;
  variant?:   "default" | "success" | "warning" | "danger" | "info";
}

const variants = {
  default: "bg-slate-100 text-slate-600 border border-slate-200",
  success: "bg-green-50  text-green-700  border border-green-200",
  warning: "bg-amber-50  text-amber-700  border border-amber-200",
  danger:  "bg-red-50    text-red-600    border border-red-200",
  info:    "bg-blue-50   text-blue-600   border border-blue-200",
};

export function Badge({ children, className, variant = "default" }: BadgeProps) {
  return (
    <span className={cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}