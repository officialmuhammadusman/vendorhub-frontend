import { cn } from "@/utils";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating:     number;
  max?:       number;
  size?:      "sm" | "md" | "lg";
  onRate?:    (rating: number) => void;
  showCount?: boolean;
  count?:     number;
}

const sizes = { sm: "h-3 w-3", md: "h-4 w-4", lg: "h-5 w-5" };

export function StarRating({ rating, max = 5, size = "md", onRate, showCount, count }: StarRatingProps) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => {
        const filled = i < Math.floor(rating);
        const half   = !filled && i < rating;
        return (
          <Star
            key={i}
            className={cn(
              sizes[size],
              onRate && "cursor-pointer hover:scale-110 transition-transform duration-100",
              filled ? "fill-amber-400 text-amber-400"
              : half  ? "fill-amber-200 text-amber-400"
              :         "fill-slate-100 text-slate-300"
            )}
            onClick={() => onRate?.(i + 1)}
          />
        );
      })}
      {showCount && count !== undefined && (
        <span className="ml-1 text-xs text-slate-400">({count})</span>
      )}
    </div>
  );
}