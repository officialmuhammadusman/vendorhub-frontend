"use client";
import Link  from "next/link";
import Image from "next/image";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { Button }         from "@/components/ui/Button";
import { useCart }        from "@/hooks/useCart";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { setCartOpen }    from "@/store/slices/uiSlice";
import { useAppSelector } from "@/hooks/useAppSelector";
import { formatPrice }    from "@/utils";
import { APP_ROUTES }     from "@/constants";

export function CartDrawer() {
  const dispatch = useAppDispatch();
  const isOpen   = useAppSelector((s) => s.ui.isCartOpen);
  const { cart, update, remove, isLoading } = useCart();

  const items = (cart as { items: { product: { _id: string; title: string; images: { url: string }[] }; quantity: number; price: number }[]; subtotal: number; discount: number; total: number; coupon: { code: string } | null } | null)?.items || [];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm"
          onClick={() => dispatch(setCartOpen(false))}
        />
      )}

      {/* Drawer */}
      <div className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/60 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 border border-amber-100">
              <ShoppingBag className="h-4 w-4 text-amber-600" />
            </span>
            <h2 className="text-base font-semibold text-slate-900">
              Cart
              {items.length > 0 && (
                <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">
                  {items.length}
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={() => dispatch(setCartOpen(false))}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors duration-150"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 border border-slate-200">
                <ShoppingBag className="h-7 w-7 text-slate-300" />
              </div>
              <p className="text-sm font-semibold text-slate-600">Your cart is empty</p>
              <p className="mt-1 text-xs text-slate-400">Add some products to get started</p>
              <Button variant="outline" className="mt-5" onClick={() => dispatch(setCartOpen(false))}>
                Continue Shopping
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product._id} className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50/40 p-3">
                {/* Thumbnail */}
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100 border border-slate-200">
                  <Image
                    src={item.product.images[0]?.url || "/placeholder.png"}
                    alt={item.product.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 line-clamp-1">{item.product.title}</p>
                  <p className="text-sm font-semibold text-amber-600 mt-0.5">{formatPrice(item.price)}</p>

                  {/* Qty controls */}
                  <div className="flex items-center gap-1.5 mt-2">
                    <button
                      disabled={isLoading}
                      onClick={() => update(item.product._id, item.quantity - 1)}
                      className="flex h-6 w-6 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50 disabled:opacity-40 transition-colors duration-150"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold text-slate-700">
                      {item.quantity}
                    </span>
                    <button
                      disabled={isLoading}
                      onClick={() => update(item.product._id, item.quantity + 1)}
                      className="flex h-6 w-6 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50 disabled:opacity-40 transition-colors duration-150"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => remove(item.product._id)}
                      className="ml-1 text-xs font-medium text-red-400 hover:text-red-600 transition-colors duration-150"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* Line total */}
                <p className="text-sm font-semibold text-slate-800 flex-shrink-0 pt-0.5">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Subtotal</span>
              <span className="font-medium text-slate-700">
                {formatPrice((cart as { subtotal: number })?.subtotal || 0)}
              </span>
            </div>
            {(cart as { discount: number })?.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-green-600">Discount</span>
                <span className="font-semibold text-green-600">
                  -{formatPrice((cart as { discount: number })?.discount || 0)}
                </span>
              </div>
            )}
            <div className="flex justify-between border-t border-slate-200 pt-3">
              <span className="text-sm font-semibold text-slate-900">Total</span>
              <span className="text-base font-bold text-amber-600">
                {formatPrice((cart as { total: number })?.total || 0)}
              </span>
            </div>
            <Link href={APP_ROUTES.CHECKOUT} onClick={() => dispatch(setCartOpen(false))}>
              <Button fullWidth size="lg">Proceed to Checkout</Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}