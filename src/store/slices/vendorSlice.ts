import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { vendorService } from "@/services/vendorService";
import type { Vendor, VendorDashboard, MonthlyEarning } from "@/types/vendor.types";

interface VendorState {
  profile:    Vendor | null;
  dashboard:  VendorDashboard | null;
  earnings:   { totalEarnings: number; totalOrders: number; monthlyEarnings: MonthlyEarning[] } | null;
  isLoading:  boolean;
}

const initialState: VendorState = { profile: null, dashboard: null, earnings: null, isLoading: false };

export const fetchVendorProfile   = createAsyncThunk("vendor/profile",   async () => vendorService.getProfile());
export const fetchVendorDashboard = createAsyncThunk("vendor/dashboard", async () => vendorService.getDashboard());
export const fetchVendorEarnings  = createAsyncThunk("vendor/earnings",  async () => vendorService.getEarnings());
export const setupVendor          = createAsyncThunk("vendor/setup",     async (data: FormData) => vendorService.setup(data));
export const updateVendorProfile  = createAsyncThunk("vendor/update",    async (data: FormData) => vendorService.update(data));

const vendorSlice = createSlice({
  name: "vendor",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVendorProfile.pending,    (s) => { s.isLoading = true; })
      .addCase(fetchVendorProfile.fulfilled,  (s, a) => { s.isLoading = false; s.profile = a.payload; })
      .addCase(fetchVendorProfile.rejected,   (s) => { s.isLoading = false; })
      .addCase(fetchVendorDashboard.fulfilled, (s, a) => { s.dashboard = a.payload; })
      .addCase(fetchVendorEarnings.fulfilled,  (s, a) => { s.earnings  = a.payload; })
      .addCase(setupVendor.fulfilled,          (s, a) => { s.profile   = a.payload; })
      .addCase(updateVendorProfile.fulfilled,  (s, a) => { s.profile   = a.payload; });
  },
});

export default vendorSlice.reducer;
