import { Button } from "./Button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page:         number;
  totalPages:   number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
    if (totalPages <= 5)        return i + 1;
    if (page <= 3)              return i + 1;
    if (page >= totalPages - 2) return totalPages - 4 + i;
    return page - 2 + i;
  });

  return (
    <div className="flex items-center justify-center gap-1.5">
      <Button
        variant="ghost" size="sm"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={
            p === page
              ? "h-8 w-8 rounded-lg bg-amber-500 text-xs font-semibold text-white shadow-sm shadow-amber-200"
              : "h-8 w-8 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors duration-150"
          }
        >
          {p}
        </button>
      ))}

      <Button
        variant="ghost" size="sm"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}