import { useCallback, useEffect, useRef, useState } from "react";
import { useAppDispatch } from "./useAppDispatch";
import { useAppSelector }  from "./useAppSelector";
import { fetchProducts, fetchProductById, fetchMyProducts } from "@/store/slices/productSlice";
import type { ProductFilters } from "@/types/product.types";

export function useProducts() {
  const dispatch = useAppDispatch();
  const { products, currentProduct, myProducts, isLoading } = useAppSelector((s) => s.products);

  const loadProducts   = useCallback((filters: ProductFilters = {}) => dispatch(fetchProducts(filters)), [dispatch]);
  const loadProduct    = useCallback((id: string) => dispatch(fetchProductById(id)), [dispatch]);
  const loadMyProducts = useCallback((filters: ProductFilters = {}) => dispatch(fetchMyProducts(filters)), [dispatch]);

  return { products, currentProduct, myProducts, isLoading, loadProducts, loadProduct, loadMyProducts };
}

/** Debounced search — fires only after user stops typing for `delay` ms */
export function useDebouncedSearch(value: string, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}