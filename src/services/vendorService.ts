import axiosInstance from "@/lib/axios";
import { API_ROUTES } from "@/constants";

export const vendorService = {
  setup: async (data: FormData) => {
    const res = await axiosInstance.post(API_ROUTES.VENDOR.SETUP, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  },

  getProfile: async () => {
    const res = await axiosInstance.get(API_ROUTES.VENDOR.ME);
    return res.data.data;
  },

  update: async (data: FormData) => {
    const res = await axiosInstance.patch(API_ROUTES.VENDOR.UPDATE, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  },

  getDashboard: async () => {
    const res = await axiosInstance.get(API_ROUTES.VENDOR.DASHBOARD);
    return res.data.data;
  },

  getEarnings: async () => {
    const res = await axiosInstance.get(API_ROUTES.VENDOR.EARNINGS);
    return res.data.data;
  },

  getStore: async (vendorId: string) => {
    const res = await axiosInstance.get(API_ROUTES.VENDOR.STORE(vendorId));
    return res.data.data;
  },
};
