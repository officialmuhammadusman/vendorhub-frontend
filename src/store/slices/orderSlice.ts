import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { orderService } from "@/services/orderService";
import type { Order } from "@/types/order.types";

interface OrderState {
  orders:        { orders: Order[]; pagination: unknown } | null;
  currentOrder:  Order | null;
  isLoading:     boolean;
}

const initialState: OrderState = { orders: null, currentOrder: null, isLoading: false };

export const fetchMyOrders   = createAsyncThunk("orders/fetchMine",   async (filters: Record<string,unknown> = {}) => orderService.getMyOrders(filters));
export const fetchOrderById  = createAsyncThunk("orders/fetchById",   async (id: string) => orderService.getById(id));
export const cancelOrder     = createAsyncThunk("orders/cancel",      async (id: string) => orderService.cancel(id));
export const updateOrderStatus = createAsyncThunk("orders/updateStatus", async ({ id, status }: { id: string; status: string }) => orderService.updateStatus(id, status));

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: { clearCurrentOrder: (s) => { s.currentOrder = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyOrders.pending,    (s) => { s.isLoading = true; })
      .addCase(fetchMyOrders.fulfilled,  (s, a) => { s.isLoading = false; s.orders = a.payload; })
      .addCase(fetchMyOrders.rejected,   (s) => { s.isLoading = false; })
      .addCase(fetchOrderById.pending,   (s) => { s.isLoading = true; })
      .addCase(fetchOrderById.fulfilled, (s, a) => { s.isLoading = false; s.currentOrder = a.payload; })
      .addCase(fetchOrderById.rejected,  (s) => { s.isLoading = false; })
      .addCase(cancelOrder.fulfilled,    (s, a) => { s.currentOrder = a.payload; })
      .addCase(updateOrderStatus.fulfilled, (s, a) => { s.currentOrder = a.payload; });
  },
});

export const { clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
