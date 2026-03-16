import axiosInstance from "@/lib/axios";
import { API_ROUTES } from "@/constants";
import { buildQueryString } from "@/utils";

export const reviewService = {
  getByProduct: async (productId: string, filters = {}) => {
    const query = buildQueryString(filters as Record<string, unknown>);
    const res   = await axiosInstance.get(`${API_ROUTES.REVIEWS.BY_PRODUCT(productId)}${query}`);
    return res.data.data;
  },

  create: async (data: FormData) => {
    const res = await axiosInstance.post(API_ROUTES.REVIEWS.BASE, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  },

  getMyReviews: async () => {
    const res = await axiosInstance.get(API_ROUTES.REVIEWS.MY_REVIEWS);
    return res.data.data;
  },

  update: async (id: string, data: { rating?: number; comment?: string }) => {
    const res = await axiosInstance.patch(API_ROUTES.REVIEWS.BY_ID(id), data);
    return res.data.data;
  },

  delete: async (id: string) => {
    await axiosInstance.delete(API_ROUTES.REVIEWS.BY_ID(id));
  },
};
