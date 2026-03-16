import axiosInstance from "@/lib/axios";
import { API_ROUTES } from "@/constants";
import type { RegisterPayload, LoginPayload, AuthResponse } from "@/types/auth.types";

export const authService = {
  register: async (data: RegisterPayload): Promise<AuthResponse> => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) formData.append(key, value as string | Blob);
    });
    const res = await axiosInstance.post(API_ROUTES.AUTH.REGISTER, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  },

  login: async (data: LoginPayload): Promise<AuthResponse> => {
    const res = await axiosInstance.post(API_ROUTES.AUTH.LOGIN, data);
    return res.data.data;
  },

  logout: async (): Promise<void> => {
    await axiosInstance.post(API_ROUTES.AUTH.LOGOUT);
  },

  getMe: async () => {
    const res = await axiosInstance.get(API_ROUTES.AUTH.ME);
    return res.data.data;
  },

  changePassword: async (data: { oldPassword: string; newPassword: string }) => {
    const res = await axiosInstance.patch(API_ROUTES.AUTH.CHANGE_PASSWORD, data);
    return res.data;
  },

  updateProfile: async (data: FormData) => {
    const res = await axiosInstance.patch(API_ROUTES.AUTH.UPDATE_PROFILE, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  },
};
