import { useEffect } from "react";
import { useAppDispatch } from "./useAppDispatch";
import { useAppSelector }  from "./useAppSelector";
import { fetchCart, addToCart, updateCartItem, removeCartItem, applyCartCoupon, removeCartCoupon } from "@/store/slices/cartSlice";
import { useAuth } from "./useAuth";

export function useCart() {
  const dispatch  = useAppDispatch();
  const { isAuth } = useAuth();
  const { cart, isLoading } = useAppSelector((s) => s.cart) as {
    cart: {
      items: { product: { _id: string }; quantity: number; price: number }[];
      subtotal: number;
      discount: number;
      total: number;
      coupon: { code: string } | null;
    } | null;
    isLoading: boolean;
  };

  useEffect(() => {
    if (isAuth) dispatch(fetchCart());
  }, [isAuth, dispatch]);

  const itemCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) ?? 0;

  const add    = (productId: string, quantity = 1) => dispatch(addToCart({ productId, quantity }));
  const update = (productId: string, quantity: number) => dispatch(updateCartItem({ productId, quantity }));
  const remove = (productId: string) => dispatch(removeCartItem(productId));
  const applyCoupon  = (code: string) => dispatch(applyCartCoupon(code));
  const removeCoupon = ()             => dispatch(removeCartCoupon());

  return { cart, isLoading, itemCount, add, update, remove, applyCoupon, removeCoupon };
}
