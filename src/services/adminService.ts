import axiosInstance from "@/lib/axios";
import { API_ROUTES } from "@/constants";
import { buildQueryString } from "@/utils";

export const adminService = {
  getStats: async () => {
    const res = await axiosInstance.get(API_ROUTES.ADMIN.STATS);
    return res.data.data;
  },

  getUsers: async (filters = {}) => {
    const query = buildQueryString(filters as Record<string, unknown>);
    const res   = await axiosInstance.get(`${API_ROUTES.ADMIN.USERS}${query}`);
    return res.data.data;
  },

  toggleUser: async (id: string) => {
    const res = await axiosInstance.patch(API_ROUTES.ADMIN.TOGGLE_USER(id));
    return res.data.data;
  },

  getVendors: async (filters = {}) => {
    const query = buildQueryString(filters as Record<string, unknown>);
    const res   = await axiosInstance.get(`${API_ROUTES.ADMIN.VENDORS}${query}`);
    return res.data.data;
  },

  approveVendor: async (id: string) => {
    const res = await axiosInstance.patch(API_ROUTES.ADMIN.APPROVE_VENDOR(id));
    return res.data.data;
  },

  suspendVendor: async (id: string) => {
    const res = await axiosInstance.patch(API_ROUTES.ADMIN.SUSPEND_VENDOR(id));
    return res.data.data;
  },

  getOrders: async (filters = {}) => {
    const query = buildQueryString(filters as Record<string, unknown>);
    const res   = await axiosInstance.get(`${API_ROUTES.ADMIN.ORDERS}${query}`);
    return res.data.data;
  },

  getProducts: async (filters = {}) => {
    const query = buildQueryString(filters as Record<string, unknown>);
    const res   = await axiosInstance.get(`${API_ROUTES.ADMIN.PRODUCTS}${query}`);
    return res.data.data;
  },

  removeProduct: async (id: string) => {
    const res = await axiosInstance.patch(API_ROUTES.ADMIN.REMOVE_PRODUCT(id));
    return res.data.data;
  },

  deleteReview: async (id: string) => {
    await axiosInstance.delete(API_ROUTES.ADMIN.DELETE_REVIEW(id));
  },
};
