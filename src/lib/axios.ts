import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL, API_ROUTES } from "@/constants";
import { store } from "@/store";
import { logout, setTokens } from "@/store/slices/authSlice";

const axiosInstance = axios.create({
  baseURL:         API_BASE_URL,
  withCredentials: true,
  headers:         { "Content-Type": "application/json" },
  timeout:         15000,
});

// ─── Request Interceptor — read token directly from localStorage ──
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Read directly from localStorage — plain string, no JSON parsing needed
    const token = typeof window !== "undefined"
      ? localStorage.getItem("vh_access_token")
      : store.getState().auth.accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor — refresh token on 401 ─────────────────
let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)));
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = typeof window !== "undefined"
          ? localStorage.getItem("vh_refresh_token")
          : store.getState().auth.refreshToken;

        if (!refreshToken) throw new Error("No refresh token");

        const { data } = await axios.post(
          `${API_BASE_URL}${API_ROUTES.AUTH.REFRESH_TOKEN}`,
          { refreshToken }
        );

        const newAccess  = data.data.accessToken;
        const newRefresh = data.data.refreshToken || refreshToken;

        store.dispatch(setTokens({ accessToken: newAccess, refreshToken: newRefresh }));

        processQueue(null, newAccess);
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        store.dispatch(logout());
        if (typeof window !== "undefined") window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;