import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { productService } from "@/services/productService";
import type { Product, ProductFilters, ProductsResponse } from "@/types/product.types";

interface ProductState {
  products:       ProductsResponse | null;
  currentProduct: Product | null;
  myProducts:     ProductsResponse | null;
  isLoading:      boolean;
}

const initialState: ProductState = {
  products: null, currentProduct: null, myProducts: null, isLoading: false,
};

export const fetchProducts    = createAsyncThunk("products/fetchAll",  async (filters: ProductFilters) => productService.getAll(filters));
export const fetchProductById = createAsyncThunk("products/fetchById", async (id: string) => productService.getById(id));
export const fetchMyProducts  = createAsyncThunk("products/fetchMine", async (filters: ProductFilters) => productService.getMyProducts(filters));
export const createProduct    = createAsyncThunk("products/create",    async (data: FormData) => productService.create(data));
export const deleteProduct    = createAsyncThunk("products/delete",    async (id: string) => { await productService.delete(id); return id; });

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearCurrentProduct: (state) => { state.currentProduct = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending,    (s) => { s.isLoading = true; })
      .addCase(fetchProducts.fulfilled,  (s, a) => { s.isLoading = false; s.products = a.payload; })
      .addCase(fetchProducts.rejected,   (s) => { s.isLoading = false; })
      .addCase(fetchProductById.pending,   (s) => { s.isLoading = true; })
      .addCase(fetchProductById.fulfilled, (s, a) => { s.isLoading = false; s.currentProduct = a.payload; })
      .addCase(fetchProductById.rejected,  (s) => { s.isLoading = false; })
      .addCase(fetchMyProducts.pending,   (s) => { s.isLoading = true; })
      .addCase(fetchMyProducts.fulfilled, (s, a) => { s.isLoading = false; s.myProducts = a.payload; })
      .addCase(fetchMyProducts.rejected,  (s) => { s.isLoading = false; })
      .addCase(deleteProduct.fulfilled,   (s, a) => {
        if (s.myProducts) {
          s.myProducts.products = s.myProducts.products.filter((p) => p._id !== a.payload);
        }
      });
  },
});

export const { clearCurrentProduct } = productSlice.actions;
export default productSlice.reducer;
