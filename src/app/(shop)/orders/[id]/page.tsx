"use client";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Button }    from "@/components/ui/Button";
import { PageLoader } from "@/components/ui/Spinner";
import { useOrders } from "@/hooks/useOrders";
import { useToast }  from "@/hooks/useToast";
import { formatPrice, formatDate } from "@/utils";
import { ORDER_STATUS_COLORS, PAYMENT_STATUS_COLORS } from "@/constants";
import { Package, MapPin, CreditCard, CheckCircle } from "lucide-react";

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { currentOrder, isLoading, loadOrder, cancel } = useOrders();
  const toast = useToast();

  useEffect(() => { loadOrder(id); }, [id]);

  const handleCancel = async () => {
    if (!confirm("Cancel this order? A refund will be issued.")) return;
    try {
      await cancel(id);
      toast.success("Order cancelled and refund initiated");
    } catch { toast.error("Cannot cancel this order"); }
  };

  if (isLoading || !currentOrder) return <PageLoader />;
  const o = currentOrder;

  const steps = ["pending", "confirmed", "shipped", "delivered"];
  const currentStep = steps.indexOf(o.status);

  return (
    <ProtectedRoute allowedRoles={["customer"]}>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Order #{o._id.slice(-8).toUpperCase()}
            </h1>
            <p className="mt-1 text-sm text-gray-500">Placed on {formatDate(o.createdAt)}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`rounded-full px-3 py-1 text-sm font-medium ${ORDER_STATUS_COLORS[o.status]}`}>
              {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
            </span>
            <span className={`rounded-full px-3 py-1 text-sm font-medium ${PAYMENT_STATUS_COLORS[o.paymentStatus]}`}>
              {o.paymentStatus.charAt(0).toUpperCase() + o.paymentStatus.slice(1)}
            </span>
          </div>
        </div>

        {/* Progress Tracker */}
        {!["cancelled","refunded"].includes(o.status) && (
          <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between">
              {steps.map((step, i) => (
                <div key={step} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-colors ${
                      i <= currentStep ? "border-indigo-600 bg-indigo-600 text-white" : "border-gray-300 text-gray-400"
                    }`}>
                      {i < currentStep ? <CheckCircle className="h-5 w-5" /> : <span className="text-xs font-bold">{i + 1}</span>}
                    </div>
                    <p className={`mt-1 text-xs font-medium ${i <= currentStep ? "text-indigo-600" : "text-gray-400"}`}>
                      {step.charAt(0).toUpperCase() + step.slice(1)}
                    </p>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`h-0.5 flex-1 mx-2 mb-4 ${i < currentStep ? "bg-indigo-600" : "bg-gray-200"}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Items */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-center gap-2 mb-4">
                <Package className="h-5 w-5 text-indigo-600" />
                <h2 className="font-semibold text-gray-900">Order Items ({o.items.length})</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {o.items.map((item, i) => (
                  <div key={i} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                      <Image src={item.image || item.product?.images?.[0]?.url || "/placeholder.png"} alt={item.title} fill className="object-cover" />
                    </div>
                    <div className="flex flex-1 justify-between min-w-0">
                      <div>
                        <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.title}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900 flex-shrink-0">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-5 w-5 text-indigo-600" />
                <h2 className="font-semibold text-gray-900">Shipping Address</h2>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-medium text-gray-900">{o.shippingAddress.fullName}</p>
                <p>{o.shippingAddress.phone}</p>
                <p>{o.shippingAddress.address}</p>
                <p>{o.shippingAddress.city}, {o.shippingAddress.state} {o.shippingAddress.postalCode}</p>
                <p>{o.shippingAddress.country}</p>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-4">
            <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <CreditCard className="h-5 w-5 text-indigo-600" />
                <h2 className="font-semibold text-gray-900">Payment</h2>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span><span>{formatPrice(o.subtotal)}</span>
              </div>
              {o.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount {o.coupon && `(${o.coupon.code})`}</span>
                  <span>-{formatPrice(o.discount)}</span>
                </div>
              )}
              <div className="border-t pt-3 flex justify-between font-bold text-gray-900">
                <span>Total Paid</span>
                <span className="text-indigo-600">{formatPrice(o.total)}</span>
              </div>
            </div>

            {["pending","confirmed"].includes(o.status) && (
              <Button variant="danger" fullWidth onClick={handleCancel}>Cancel Order</Button>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
