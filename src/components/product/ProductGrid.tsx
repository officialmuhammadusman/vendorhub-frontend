import { ProductCard } from "./ProductCard";
import { EmptyState }  from "@/components/ui/EmptyState";
import { PageLoader }  from "@/components/ui/Spinner";
import { Package }     from "lucide-react";
import type { Product } from "@/types/product.types";

interface ProductGridProps {
  products:  Product[];
  isLoading: boolean;
}

export function ProductGrid({ products, isLoading }: ProductGridProps) {
  if (isLoading) return <PageLoader />;

  if (!products.length) {
    return (
      <EmptyState
        icon={<Package className="h-7 w-7" />}
        title="No products found"
        message="Try adjusting your filters or search terms"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}