import { cn } from "@/utils";

interface CardProps { children: React.ReactNode; className?: string; onClick?: () => void; }

export function Card({ children, className, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-xl border border-slate-200 bg-white shadow-sm",
        onClick && "cursor-pointer hover:shadow-md hover:border-slate-300 transition-all duration-200",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("border-b border-slate-100 bg-slate-50/60 px-6 py-4", className)}>
      {children}
    </div>
  );
}

export function CardBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("px-6 py-4", className)}>{children}</div>;
}