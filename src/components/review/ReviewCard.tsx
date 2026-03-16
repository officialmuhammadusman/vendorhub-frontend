import { StarRating }  from "@/components/ui/StarRating";
import { Avatar }      from "@/components/ui/Avatar";
import { formatDate }  from "@/utils";
import { CheckCircle } from "lucide-react";
import type { Review } from "@/types/review.types";

export function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="border-b border-slate-100 py-5 last:border-0">
      <div className="flex items-start gap-3">
        <Avatar src={review.user?.avatar?.url} name={review.user?.fullName} />
        <div className="flex-1 min-w-0">

          {/* Name + verified badge */}
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-slate-900">{review.user?.fullName}</p>
            {review.isVerifiedPurchase && (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-50 border border-green-200 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                <CheckCircle className="h-3 w-3" />
                Verified Purchase
              </span>
            )}
          </div>

          {/* Stars + date */}
          <div className="flex items-center gap-2 mt-1">
            <StarRating rating={review.rating} size="sm" />
            <span className="text-xs text-slate-400">{formatDate(review.createdAt)}</span>
          </div>

          {/* Comment */}
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">{review.comment}</p>

          {/* Review images */}
          {review.images?.length > 0 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {review.images.map((img, i) => (
                <img
                  key={i}
                  src={img.url}
                  alt="review"
                  className="h-16 w-16 rounded-lg object-cover border border-slate-200"
                />
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}