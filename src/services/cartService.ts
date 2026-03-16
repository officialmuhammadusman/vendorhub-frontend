import axiosInstance from "@/lib/axios";
import { API_ROUTES } from "@/constants";

export const cartService = {
  getCart: async () => {
    const res = await axiosInstance.get(API_ROUTES.CART.BASE);
    return res.data.data;
  },

  addToCart: async (productId: string, quantity = 1) => {
    const res = await axiosInstance.post(API_ROUTES.CART.ADD, { productId, quantity });
    return res.data.data;
  },

  updateItem: async (productId: string, quantity: number) => {
    const res = await axiosInstance.patch(API_ROUTES.CART.ITEM(productId), { quantity });
    return res.data.data;
  },

  removeItem: async (productId: string) => {
    const res = await axiosInstance.delete(API_ROUTES.CART.ITEM(productId));
    return res.data.data;
  },

  clearCart: async () => {
    await axiosInstance.delete(API_ROUTES.CART.CLEAR);
  },

  applyCoupon: async (code: string) => {
    const res = await axiosInstance.post(API_ROUTES.CART.APPLY_COUPON, { code });
    return res.data.data;
  },

  removeCoupon: async () => {
    const res = await axiosInstance.delete(API_ROUTES.CART.REMOVE_COUPON);
    return res.data.data;
  },
};
