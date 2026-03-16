import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer    from "./slices/authSlice";
import cartReducer    from "./slices/cartSlice";
import productReducer from "./slices/productSlice";
import orderReducer   from "./slices/orderSlice";
import vendorReducer  from "./slices/vendorSlice";
import uiReducer      from "./slices/uiSlice";

const rootReducer = combineReducers({
  auth:     authReducer,
  cart:     cartReducer,
  products: productReducer,
  orders:   orderReducer,
  vendor:   vendorReducer,
  ui:       uiReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState   = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;