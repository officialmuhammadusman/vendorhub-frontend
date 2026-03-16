import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { authService } from "@/services/authService";
import type { AuthState, RegisterPayload, LoginPayload } from "@/types/auth.types";

// ─── localStorage keys ────────────────────────────────────────────
export const LS_TOKEN   = "vh_access_token";
export const LS_REFRESH = "vh_refresh_token";
export const LS_USER    = "vh_user";

export const saveAuth = (accessToken: string, refreshToken: string | null, user: object) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_TOKEN,   accessToken);
  localStorage.setItem(LS_REFRESH, refreshToken || "");
  localStorage.setItem(LS_USER,    JSON.stringify(user));
};

export const clearAuth = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(LS_TOKEN);
  localStorage.removeItem(LS_REFRESH);
  localStorage.removeItem(LS_USER);
};

// ─── Always start with empty state (SSR safe) ─────────────────────
// localStorage is read in providers.tsx after mount
const initialState: AuthState = {
  user:         null,
  accessToken:  null,
  refreshToken: null,
  isLoading:    false,
  isAuth:       false,
};

// ─── Thunks ───────────────────────────────────────────────────────
export const registerUser = createAsyncThunk(
  "auth/register",
  async (data: RegisterPayload, { rejectWithValue }) => {
    try {
      const result = await authService.register(data);
      saveAuth(result.accessToken, result.refreshToken || null, result.user);
      return result;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Registration failed");
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (data: LoginPayload, { rejectWithValue }) => {
    try {
      const result = await authService.login(data);
      saveAuth(result.accessToken, result.refreshToken || null, result.user);
      return result;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      clearAuth();
      await authService.logout();
    } catch (error: unknown) {
      clearAuth();
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Logout failed");
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  "auth/me",
  async (_, { rejectWithValue }) => {
    try {
      const user = await authService.getMe();
      if (typeof window !== "undefined") {
        localStorage.setItem(LS_USER, JSON.stringify(user));
      }
      return user;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Failed to fetch user");
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Called from providers.tsx on client mount to hydrate from localStorage
    hydrateAuth: (state) => {
      if (typeof window === "undefined") return;
      const accessToken  = localStorage.getItem(LS_TOKEN)   || null;
      const refreshToken = localStorage.getItem(LS_REFRESH) || null;
      const userStr      = localStorage.getItem(LS_USER);
      let user = null;
      try { if (userStr) user = JSON.parse(userStr); } catch { user = null; }
      if (accessToken) {
        state.accessToken  = accessToken;
        state.refreshToken = refreshToken;
        state.user         = user;
        state.isAuth       = true;
      }
    },
    setTokens: (state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) => {
      state.accessToken  = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuth       = true;
      if (typeof window !== "undefined") {
        localStorage.setItem(LS_TOKEN,   action.payload.accessToken);
        localStorage.setItem(LS_REFRESH, action.payload.refreshToken);
      }
    },
    logout: (state) => {
      state.user = null; state.accessToken = null;
      state.refreshToken = null; state.isAuth = false;
      clearAuth();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending,   (s) => { s.isLoading = true; })
      .addCase(registerUser.fulfilled, (s, a) => {
        s.isLoading = false; s.isAuth = true;
        s.user = a.payload.user;
        s.accessToken  = a.payload.accessToken;
        s.refreshToken = a.payload.refreshToken || null;
      })
      .addCase(registerUser.rejected,  (s) => { s.isLoading = false; });

    builder
      .addCase(loginUser.pending,   (s) => { s.isLoading = true; })
      .addCase(loginUser.fulfilled, (s, a) => {
        s.isLoading = false; s.isAuth = true;
        s.user = a.payload.user;
        s.accessToken  = a.payload.accessToken;
        s.refreshToken = a.payload.refreshToken || null;
      })
      .addCase(loginUser.rejected,  (s) => { s.isLoading = false; });

    builder
      .addCase(logoutUser.pending,   (s) => { s.isLoading = true; })
      .addCase(logoutUser.fulfilled, (s) => {
        s.isLoading = false; s.user = null;
        s.accessToken = null; s.refreshToken = null; s.isAuth = false;
      })
      .addCase(logoutUser.rejected,  (s) => { s.isLoading = false; });

    builder
      .addCase(fetchCurrentUser.pending,   (s) => { s.isLoading = true; })
      .addCase(fetchCurrentUser.fulfilled, (s, a) => {
        s.isLoading = false; s.isAuth = true; s.user = a.payload;
      })
      .addCase(fetchCurrentUser.rejected,  (s) => {
        s.isLoading = false; s.isAuth = false;
        s.user = null; s.accessToken = null; s.refreshToken = null;
        clearAuth();
      });
  },
});

export const { setTokens, logout, hydrateAuth } = authSlice.actions;
export default authSlice.reducer;