"use client";
import Image from "next/image";
import Link  from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button }      from "@/components/ui/Button";
import { Badge }       from "@/components/ui/Badge";
import { StarRating }  from "@/components/ui/StarRating";
import { formatPrice, calcDiscountPercent, getEffectivePrice } from "@/utils";
import { APP_ROUTES, LOW_STOCK_THRESHOLD } from "@/constants";
import { useCart }  from "@/hooks/useCart";
import { useToast } from "@/hooks/useToast";
import { useAuth }  from "@/hooks/useAuth";
import type { Product } from "@/types/product.types";

export function ProductCard({ product }: { product: Product }) {
  const { add, isLoading } = useCart();
  const toast = useToast();
  const { isAuth, isVendor, isAdmin } = useAuth();

  const effectivePrice = getEffectivePrice(product.price, product.discountPrice);
  const discount       = calcDiscountPercent(product.price, product.discountPrice);
  const isLowStock     = product.stock <= LOW_STOCK_THRESHOLD && product.stock > 0;
  const isOutOfStock   = product.stock === 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuth)              { toast.error("Please login to add items to cart"); return; }
    if (isVendor || isAdmin)  { toast.info("Switch to a customer account to shop"); return; }
    try {
      await add(product._id, 1);
      toast.success("Added to cart!");
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  return (
    <Link href={APP_ROUTES.PRODUCT(product._id)} className="group">
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden hover:shadow-md hover:border-slate-300 transition-all duration-200">

        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-slate-100">
          <Image
            src={product.images[0]?.url || "/placeholder.png"}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {discount > 0 && (
            <Badge className="absolute top-2 left-2 bg-red-500 text-white text-[10px]">
              {discount}% OFF
            </Badge>
          )}
          {isLowStock   && <Badge className="absolute top-2 right-2" variant="warning">Low Stock</Badge>}
          {isOutOfStock && <Badge className="absolute top-2 right-2" variant="danger">Out of Stock</Badge>}
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-slate-400 mb-1 font-medium">{product.vendor?.storeName}</p>
          <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 mb-2 leading-snug">
            {product.title}
          </h3>

          <div className="flex items-center gap-1 mb-3">
            <StarRating rating={product.ratings.average} size="sm" />
            <span className="text-xs text-slate-400">({product.ratings.count})</span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-base font-black text-slate-900">
                {formatPrice(effectivePrice)}
              </span>
              {discount > 0 && (
                <span className="ml-2 text-xs text-slate-400 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
            <Button
              size="sm"
              variant="primary"
              disabled={isOutOfStock || isLoading}
              onClick={handleAddToCart}
              className="!bg-amber-500 hover:!bg-amber-600 !shadow-sm !shadow-amber-200 rounded-lg transition-all duration-150"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

      </div>
    </Link>
  );
}