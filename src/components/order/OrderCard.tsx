import Link from "next/link";
import Image from "next/image";
import { Badge }     from "@/components/ui/Badge";
import { Button }    from "@/components/ui/Button";
import { formatPrice, formatDate } from "@/utils";
import { ORDER_STATUS_COLORS, APP_ROUTES } from "@/constants";
import type { Order } from "@/types/order.types";

export function OrderCard({ order }: { order: Order }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/60 px-5 py-3">
        <div>
          <p className="text-xs font-semibold text-slate-700">
            Order #{order._id.slice(-8).toUpperCase()}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">{formatDate(order.createdAt)}</p>
        </div>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${ORDER_STATUS_COLORS[order.status]}`}>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </div>

      {/* Body */}
      <div className="px-5 py-4">
        {/* Product thumbnails */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {order.items.slice(0, 3).map((item, i) => (
            <div key={i} className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100 border border-slate-200">
              <Image
                src={item.image || item.product?.images?.[0]?.url || "/placeholder.png"}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>
          ))}
          {order.items.length > 3 && (
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-500">
              +{order.items.length - 3}
            </div>
          )}
        </div>

        {/* Footer row */}
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">
              {order.items.length} item{order.items.length !== 1 ? "s" : ""}
            </p>
            <p className="text-base font-bold text-slate-900 mt-0.5">
              {formatPrice(order.total)}
            </p>
          </div>
          <Link href={APP_ROUTES.ORDER(order._id)}>
            <Button variant="outline" size="sm">View Details</Button>
          </Link>
        </div>
      </div>

    </div>
  );
}