import axiosInstance from "@/lib/axios";
import { API_ROUTES } from "@/constants";
import { buildQueryString } from "@/utils";
import type { ProductFilters, ProductsResponse, Product } from "@/types/product.types";

export const productService = {
  getAll: async (filters: ProductFilters = {}): Promise<ProductsResponse> => {
    const query = buildQueryString(filters as Record<string, unknown>);
    const res   = await axiosInstance.get(`${API_ROUTES.PRODUCTS.BASE}${query}`);
    return res.data.data;
  },

  getById: async (id: string): Promise<Product> => {
    const res = await axiosInstance.get(API_ROUTES.PRODUCTS.BY_ID(id));
    return res.data.data;
  },

  getMyProducts: async (filters = {}): Promise<ProductsResponse> => {
    const query = buildQueryString(filters as Record<string, unknown>);
    const res   = await axiosInstance.get(`${API_ROUTES.PRODUCTS.MY_PRODUCTS}${query}`);
    return res.data.data;
  },

  create: async (data: FormData): Promise<Product> => {
    const res = await axiosInstance.post(API_ROUTES.PRODUCTS.BASE, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  },

  update: async (id: string, data: FormData | Record<string, unknown>): Promise<Product> => {
    const res = await axiosInstance.patch(API_ROUTES.PRODUCTS.BY_ID(id), data, {
      headers: data instanceof FormData ? { "Content-Type": "multipart/form-data" } : {},
    });
    return res.data.data;
  },

  updateStock: async (id: string, stock: number) => {
    const res = await axiosInstance.patch(API_ROUTES.PRODUCTS.UPDATE_STOCK(id), { stock });
    return res.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(API_ROUTES.PRODUCTS.BY_ID(id));
  },

  deleteImage: async (productId: string, publicId: string): Promise<void> => {
    await axiosInstance.delete(API_ROUTES.PRODUCTS.DELETE_IMAGE(productId, encodeURIComponent(publicId)));
  },
};
