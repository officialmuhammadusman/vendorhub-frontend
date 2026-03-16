import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { cartService } from "@/services/cartService";

interface CartState {
  cart:      unknown;
  isLoading: boolean;
}

const initialState: CartState = { cart: null, isLoading: false };

export const fetchCart       = createAsyncThunk("cart/fetch",         async () => cartService.getCart());
export const addToCart       = createAsyncThunk("cart/add",           async ({ productId, quantity }: { productId: string; quantity: number }) => cartService.addToCart(productId, quantity));
export const updateCartItem  = createAsyncThunk("cart/update",        async ({ productId, quantity }: { productId: string; quantity: number }) => cartService.updateItem(productId, quantity));
export const removeCartItem  = createAsyncThunk("cart/remove",        async (productId: string) => cartService.removeItem(productId));
export const clearCart       = createAsyncThunk("cart/clear",         async () => cartService.clearCart());
export const applyCartCoupon = createAsyncThunk("cart/applyCoupon",   async (code: string) => cartService.applyCoupon(code));
export const removeCartCoupon= createAsyncThunk("cart/removeCoupon",  async () => cartService.removeCoupon());

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const setCart = (state: CartState, action: { payload: unknown }) => {
      state.isLoading = false;
      state.cart      = action.payload;
    };
    [fetchCart, addToCart, updateCartItem, removeCartItem, applyCartCoupon, removeCartCoupon].forEach((thunk) => {
      builder.addCase(thunk.pending,   (s) => { s.isLoading = true; });
      builder.addCase(thunk.fulfilled, setCart);
      builder.addCase(thunk.rejected,  (s) => { s.isLoading = false; });
    });
    builder.addCase(clearCart.fulfilled, (s) => { s.isLoading = false; s.cart = null; });
  },
});

export default cartSlice.reducer;
