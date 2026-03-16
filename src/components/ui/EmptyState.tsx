import { cn } from "@/utils";

interface EmptyStateProps {
  icon?:      React.ReactNode;
  title:      string;
  message?:   string;
  action?:    React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, message, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 text-center", className)}>
      {icon && (
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 border border-slate-200 text-slate-300">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-slate-700">{title}</h3>
      {message && <p className="mt-1.5 text-sm text-slate-400 max-w-xs">{message}</p>}
      {action  && <div className="mt-5">{action}</div>}
    </div>
  );
}