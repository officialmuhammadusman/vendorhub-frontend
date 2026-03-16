"use client";
import { useState, useEffect } from "react";
import { useRouter }  from "next/navigation";
import { useFormik }  from "formik";
import { loadStripe } from "@stripe/stripe-js";
import { checkoutSchema } from "@/validations/checkoutSchema";
import { Input }   from "@/components/ui/Input";
import { Button }  from "@/components/ui/Button";
import { ProtectedRoute }  from "@/components/auth/ProtectedRoute";
import { useCart }   from "@/hooks/useCart";
import { useToast }  from "@/hooks/useToast";
import { orderService } from "@/services/orderService";
import { formatPrice }  from "@/utils";
import { APP_ROUTES, STRIPE_PUBLIC_KEY } from "@/constants";
import { CreditCard, MapPin, Lock, ShieldCheck } from "lucide-react";
import type { ShippingAddress } from "@/types/order.types";

// Load Stripe outside component to avoid re-creating on render
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

export default function CheckoutPage() {
  const router   = useRouter();
  const toast    = useToast();
  const { cart } = useCart();
  const [isPlacing, setPlacing] = useState(false);
  const [cardError, setCardError] = useState("");

  const c = cart as {
    subtotal: number; discount: number; total: number;
    coupon: { code: string } | null;
    items: unknown[];
  } | null;

  const formik = useFormik<ShippingAddress>({
    initialValues: {
      fullName: "", phone: "", address: "",
      city: "", state: "", postalCode: "", country: "Pakistan",
    },
    validationSchema: checkoutSchema,
    onSubmit: async (values) => {
      if (!c?.items?.length) { toast.error("Cart is empty"); return; }
      setPlacing(true);
      setCardError("");

      try {
        // Step 1: Create payment intent
        const intent = await orderService.createPaymentIntent();

        // Step 2: Confirm payment with Stripe.js using test card
        const stripe = await stripePromise;
        if (!stripe) throw new Error("Stripe not loaded");

        const { error, paymentIntent } = await stripe.confirmCardPayment(
          intent.clientSecret,
          {
            payment_method: {
              card: {
                // Use Stripe test token for development
                token: "tok_visa",
              } as unknown as { token: string },
              billing_details: {
                name:  values.fullName,
                phone: values.phone,
                address: {
                  line1:       values.address,
                  city:        values.city,
                  state:       values.state,
                  postal_code: values.postalCode,
                  country:     "PK",
                },
              },
            },
          }
        );

        if (error) {
          setCardError(error.message || "Payment failed");
          toast.error(error.message || "Payment failed");
          return;
        }

        if (paymentIntent?.status !== "succeeded") {
          toast.error("Payment was not completed");
          return;
        }

        // Step 3: Place order
        const order = await orderService.placeOrder(paymentIntent.id, values);
        toast.success("Order placed successfully!");
        window.location.href = APP_ROUTES.ORDER(order._id);
      } catch (e: unknown) {
        const err = e as { response?: { data?: { message?: string } } };
        toast.error(err?.response?.data?.message || "Failed to place order");
      } finally {
        setPlacing(false);
      }
    },
  });

  const field = (name: keyof ShippingAddress, label: string, placeholder: string, colSpan = false) => (
    <div className={colSpan ? "sm:col-span-2" : ""}>
      <Input label={label} placeholder={placeholder}
        {...formik.getFieldProps(name)}
        error={formik.touched[name] && formik.errors[name] ? formik.errors[name] : ""} />
    </div>
  );

  return (
    <ProtectedRoute allowedRoles={["customer"]}>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Checkout</h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={formik.handleSubmit} className="space-y-6">

              {/* Shipping */}
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-5 w-5 text-indigo-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Shipping Address</h2>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {field("fullName",   "Full Name",    "John Doe")}
                  {field("phone",      "Phone",        "03001234567")}
                  {field("address",    "Address",      "123 Main Street", true)}
                  {field("city",       "City",         "Karachi")}
                  {field("state",      "State",        "Sindh")}
                  {field("postalCode", "Postal Code",  "75500")}
                  {field("country",    "Country",      "Pakistan")}
                </div>
              </div>

              {/* Payment */}
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="h-5 w-5 text-indigo-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Payment</h2>
                </div>

                {/* Test mode notice */}
                <div className="rounded-lg bg-blue-50 border border-blue-200 px-4 py-3 mb-4">
                  <p className="text-sm font-semibold text-blue-800 mb-1">🧪 Test Mode — No real charge</p>
                  <p className="text-xs text-blue-700">Test card is used automatically. No card input needed.</p>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-blue-700">
                    <span>✅ Success: <code className="font-mono bg-blue-100 px-1 rounded">tok_visa</code></span>
                    <span>Card: <code className="font-mono bg-blue-100 px-1 rounded">4242 4242 4242 4242</code></span>
                  </div>
                </div>

                {/* Simulated card display */}
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Card Number</span>
                    <div className="flex gap-1">
                      {["bg-red-500","bg-orange-400"].map((c,i) => (
                        <div key={i} className={`h-5 w-5 rounded-full ${c} opacity-90`} />
                      ))}
                    </div>
                  </div>
                  <p className="font-mono text-sm text-gray-700 tracking-widest">4242 4242 4242 4242</p>
                  <div className="flex gap-6 mt-2">
                    <span className="text-xs text-gray-500">Exp: <span className="font-mono text-gray-700">12/26</span></span>
                    <span className="text-xs text-gray-500">CVV: <span className="font-mono text-gray-700">123</span></span>
                  </div>
                </div>

                {cardError && (
                  <p className="mt-2 text-sm text-red-600">{cardError}</p>
                )}
              </div>

              <Button type="submit" fullWidth size="lg" loading={isPlacing}>
                <Lock className="h-4 w-4" />
                {isPlacing ? "Processing Payment..." : `Pay ${formatPrice(c?.total || 0)}`}
              </Button>

              <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                <ShieldCheck className="h-4 w-4" />
                Secured by Stripe — Your payment info is encrypted
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 h-fit space-y-3">
            <h3 className="font-semibold text-gray-900">Order Summary</h3>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span><span>{formatPrice(c?.subtotal || 0)}</span>
            </div>
            {(c?.discount || 0) > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount {c?.coupon && `(${c.coupon.code})`}</span>
                <span>-{formatPrice(c?.discount || 0)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-gray-600">
              <span>Shipping</span><span className="text-green-600">Free</span>
            </div>
            <div className="border-t pt-3 flex justify-between font-bold text-gray-900">
              <span>Total</span>
              <span className="text-indigo-600 text-lg">{formatPrice(c?.total || 0)}</span>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}