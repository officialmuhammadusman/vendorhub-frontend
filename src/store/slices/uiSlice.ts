import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  isCartOpen:    boolean;
  isMobileMenuOpen: boolean;
  pageLoading:   boolean;
}

const initialState: UIState = {
  isCartOpen:      false,
  isMobileMenuOpen: false,
  pageLoading:     false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleCart:       (s) => { s.isCartOpen = !s.isCartOpen; },
    setCartOpen:      (s, a: PayloadAction<boolean>) => { s.isCartOpen = a.payload; },
    toggleMobileMenu: (s) => { s.isMobileMenuOpen = !s.isMobileMenuOpen; },
    setPageLoading:   (s, a: PayloadAction<boolean>) => { s.pageLoading = a.payload; },
  },
});

export const { toggleCart, setCartOpen, toggleMobileMenu, setPageLoading } = uiSlice.actions;
export default uiSlice.reducer;
