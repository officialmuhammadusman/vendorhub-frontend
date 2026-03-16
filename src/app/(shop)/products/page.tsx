"use client";
import { useEffect, useState } from "react";
import { ProductGrid }    from "@/components/product/ProductGrid";
import { ProductFilters } from "@/components/product/ProductFilters";
import { Pagination }     from "@/components/ui/Pagination";
import { useProducts }    from "@/hooks/useProducts";
import type { ProductFilters as IFilters } from "@/types/product.types";

export default function ProductsPage() {
  const { products, isLoading, loadProducts } = useProducts();
  const [filters, setFilters] = useState<IFilters>({ page: 1, limit: 12 });

  useEffect(() => { loadProducts(filters); }, [filters]);

  // Build suggestion list from currently loaded product names
 const suggestions = products?.products?.map((p) => p.title) ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">All Products</h1>
        {products?.pagination?.total !== undefined && (
          <p className="mt-1 text-sm text-gray-500">{products.pagination.total} products found</p>
        )}
      </div>
      <div className="mb-6">
        <ProductFilters
          filters={filters}
          onChange={setFilters}
          suggestions={suggestions}
        />
      </div>
      <ProductGrid products={products?.products || []} isLoading={isLoading} />
      {products?.pagination && (
        <div className="mt-8">
          <Pagination
            page={products.pagination.page}
            totalPages={products.pagination.totalPages}
            onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
          />
        </div>
      )}
    </div>
  );
}