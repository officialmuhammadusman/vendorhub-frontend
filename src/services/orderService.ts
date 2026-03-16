import axiosInstance from "@/lib/axios";
import { API_ROUTES } from "@/constants";
import { buildQueryString } from "@/utils";
import type { ShippingAddress } from "@/types/order.types";

export const orderService = {
  createPaymentIntent: async () => {
    const res = await axiosInstance.post(API_ROUTES.ORDERS.PAYMENT_INTENT);
    return res.data.data;
  },

  placeOrder: async (paymentIntentId: string, shippingAddress: ShippingAddress) => {
    const res = await axiosInstance.post(API_ROUTES.ORDERS.PLACE, { paymentIntentId, shippingAddress });
    return res.data.data;
  },

  getMyOrders: async (filters = {}) => {
    const query = buildQueryString(filters as Record<string, unknown>);
    const res   = await axiosInstance.get(`${API_ROUTES.ORDERS.MY_ORDERS}${query}`);
    return res.data.data;
  },

  getById: async (id: string) => {
    const res = await axiosInstance.get(API_ROUTES.ORDERS.BY_ID(id));
    return res.data.data;
  },

  cancel: async (id: string) => {
    const res = await axiosInstance.patch(API_ROUTES.ORDERS.CANCEL(id));
    return res.data.data;
  },

  updateStatus: async (id: string, status: string) => {
    const res = await axiosInstance.patch(API_ROUTES.ORDERS.STATUS(id), { status });
    return res.data.data;
  },
};

export const getVendorOrdersService = async (filters = {}) => {
  const query = buildQueryString(filters as Record<string, unknown>);
  const res   = await axiosInstance.get(`/orders/vendor-orders${query}`);
  return res.data.data;
};