"use client";
import Link  from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, Tag, X } from "lucide-react";
import { Button }    from "@/components/ui/Button";
import { Input }     from "@/components/ui/Input";
import { PageLoader } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useCart }   from "@/hooks/useCart";
import { useToast }  from "@/hooks/useToast";
import { formatPrice } from "@/utils";
import { APP_ROUTES } from "@/constants";
import { useState }  from "react";

export default function CartPage() {
  const { cart, isLoading, update, remove, applyCoupon, removeCoupon } = useCart();
  const toast = useToast();
  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  const c = cart as {
    items: { product: { _id: string; title: string; images: { url: string }[]; stock: number }; quantity: number; price: number }[];
    subtotal: number; discount: number; total: number;
    coupon: { code: string } | null;
  } | null;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      await applyCoupon(couponCode.trim().toUpperCase());
      toast.success("Coupon applied!");
      setCouponCode("");
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || "Invalid coupon");
    } finally { setCouponLoading(false); }
  };

  const handleRemoveCoupon = async () => {
    try { await removeCoupon(); toast.info("Coupon removed"); }
    catch { toast.error("Failed to remove coupon"); }
  };

  return (
    <ProtectedRoute allowedRoles={["customer"]}>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Shopping Cart</h1>

        {isLoading ? <PageLoader /> : !c?.items?.length ? (
          <EmptyState
            icon={<ShoppingBag className="h-16 w-16" />}
            title="Your cart is empty"
            message="Browse products and add items to your cart"
            action={<Link href={APP_ROUTES.PRODUCTS}><Button>Start Shopping</Button></Link>}
          />
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {c.items.map((item) => (
                <div key={item.product._id} className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4">
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    <Image src={item.product.images[0]?.url || "/placeholder.png"} alt={item.product.title} fill className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col justify-between min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-gray-900 line-clamp-2">{item.product.title}</p>
                      <button onClick={() => remove(item.product._id)} className="flex-shrink-0 rounded-lg p-1 text-gray-400 hover:bg-red-50 hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-2 py-1">
                        <button onClick={() => item.quantity > 1 ? update(item.product._id, item.quantity - 1) : remove(item.product._id)}
                          className="text-gray-500 hover:text-gray-900 p-0.5">
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                        <button onClick={() => update(item.product._id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="text-gray-500 hover:text-gray-900 p-0.5 disabled:opacity-40">
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="font-semibold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="space-y-4">
              {/* Coupon */}
              <div className="rounded-xl border border-gray-200 bg-white p-5">
                <h3 className="mb-3 font-semibold text-gray-900">Promo Code</h3>
                {c.coupon ? (
                  <div className="flex items-center justify-between rounded-lg bg-green-50 px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-semibold text-green-700">{c.coupon.code}</span>
                    </div>
                    <button onClick={handleRemoveCoupon} className="text-green-600 hover:text-green-800">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input placeholder="Enter coupon code" value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()} />
                    <Button variant="outline" loading={couponLoading} onClick={handleApplyCoupon}>Apply</Button>
                  </div>
                )}
              </div>

              {/* Totals */}
              <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-3">
                <h3 className="font-semibold text-gray-900">Order Summary</h3>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal ({c.items.reduce((a, i) => a + i.quantity, 0)} items)</span>
                  <span>{formatPrice(c.subtotal)}</span>
                </div>
                {c.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-{formatPrice(c.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-indigo-600 text-lg">{formatPrice(c.total)}</span>
                </div>
                <Link href={APP_ROUTES.CHECKOUT}>
                  <Button fullWidth size="lg">Proceed to Checkout</Button>
                </Link>
                <Link href={APP_ROUTES.PRODUCTS} className="block text-center text-sm text-indigo-600 hover:underline">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
