"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Store, Minus, Plus } from "lucide-react";
import { Button }     from "@/components/ui/Button";
import { StarRating } from "@/components/ui/StarRating";
import { Badge }      from "@/components/ui/Badge";
import { ReviewCard } from "@/components/review/ReviewCard";
import { PageLoader } from "@/components/ui/Spinner";
import { useProducts } from "@/hooks/useProducts";
import { useCart }     from "@/hooks/useCart";
import { useToast }    from "@/hooks/useToast";
import { useAuth }     from "@/hooks/useAuth";
import { formatPrice, calcDiscountPercent, getEffectivePrice } from "@/utils";
import { APP_ROUTES } from "@/constants";
import { reviewService } from "@/services/reviewService";
import type { Review } from "@/types/review.types";

export default function ProductDetailPage() {
  const { id }  = useParams<{ id: string }>();
  const { currentProduct, isLoading, loadProduct } = useProducts();
  const { add } = useCart();
  const toast   = useToast();
  const { isAuth, isVendor, isAdmin } = useAuth();

  const [qty, setQty]         = useState(1);
  const [activeImg, setImg]   = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => { loadProduct(id); }, [id]);
  useEffect(() => {
    if (id) reviewService.getByProduct(id).then((r) => setReviews(r.reviews || [])).catch(() => {});
  }, [id]);

  if (isLoading || !currentProduct) return <PageLoader />;

  const product      = currentProduct;
  const effectivePrice = getEffectivePrice(product.price, product.discountPrice);
  const discount     = calcDiscountPercent(product.price, product.discountPrice);
  const isOutOfStock = product.stock === 0;

  const handleAddToCart = async () => {
    if (!isAuth) { toast.error("Please login first"); return; }
    if (isVendor || isAdmin) { toast.info("Switch to customer account to shop"); return; }
    setAddingToCart(true);
    try {
      await add(product._id, qty);
      toast.success(`${qty} item${qty > 1 ? "s" : ""} added to cart!`);
    } catch { toast.error("Failed to add to cart"); }
    finally { setAddingToCart(false); }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Images */}
        <div>
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100">
            <Image src={product.images[activeImg]?.url || "/placeholder.png"} alt={product.title} fill className="object-cover" />
            {discount > 0 && <Badge className="absolute top-4 left-4 bg-red-500 text-white text-sm px-3 py-1">{discount}% OFF</Badge>}
          </div>
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setImg(i)}
                  className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${i === activeImg ? "border-indigo-500" : "border-gray-200"}`}>
                  <Image src={img.url} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <Link href={APP_ROUTES.STORE(product.vendor?._id || "")} className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 mb-2">
            <Store className="h-4 w-4" /> {product.vendor?.storeName}
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{product.title}</h1>
          <div className="flex items-center gap-2 mt-2">
            <StarRating rating={product.ratings.average} size="md" />
            <span className="text-sm text-gray-500">({product.ratings.count} reviews)</span>
          </div>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-indigo-600">{formatPrice(effectivePrice)}</span>
            {discount > 0 && <span className="text-lg text-gray-400 line-through">{formatPrice(product.price)}</span>}
          </div>

          <p className="mt-4 text-gray-600 leading-relaxed">{product.description}</p>

          {/* Stock */}
          <div className="mt-4">
            {isOutOfStock
              ? <Badge variant="danger">Out of Stock</Badge>
              : product.stock <= 5
              ? <Badge variant="warning">Only {product.stock} left</Badge>
              : <Badge variant="success">In Stock ({product.stock})</Badge>}
          </div>

          {/* Quantity + Cart */}
          {!isOutOfStock && (
            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="text-gray-500 hover:text-gray-900">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center font-medium">{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="text-gray-500 hover:text-gray-900">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <Button size="lg" loading={addingToCart} onClick={handleAddToCart} className="flex-1">
                <ShoppingCart className="h-5 w-5" /> Add to Cart
              </Button>
            </div>
          )}

          {/* Tags */}
          {product.tags?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Customer Reviews ({reviews.length})</h2>
        <div className="rounded-xl border border-gray-200 bg-white px-6">
          {reviews.length === 0
            ? <p className="py-8 text-center text-gray-400">No reviews yet</p>
            : reviews.map((r) => <ReviewCard key={r._id} review={r} />)}
        </div>
      </div>
    </div>
  );
}
