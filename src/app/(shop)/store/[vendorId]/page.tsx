"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { vendorService } from "@/services/vendorService";
import { ProductCard }  from "@/components/product/ProductCard";
import { PageLoader }   from "@/components/ui/Spinner";
import { EmptyState }   from "@/components/ui/EmptyState";
import { formatDate }   from "@/utils";
import { Store, Package, ShoppingBag, Star } from "lucide-react";
import type { Vendor } from "@/types/vendor.types";
import type { Product } from "@/types/product.types";

export default function VendorStorePage() {
  const { vendorId } = useParams<{ vendorId: string }>();
  const [data, setData]     = useState<{ vendor: Vendor; products: Product[] } | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    vendorService.getStore(vendorId)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [vendorId]);

  if (isLoading) return <PageLoader />;
  if (!data)     return <EmptyState icon={<Store className="h-12 w-12" />} title="Store not found" />;

  const { vendor, products } = data;

  return (
    <div>
      {/* Banner */}
      <div className="relative h-48 w-full overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 sm:h-64">
        {vendor.storeBanner?.url && (
          <Image src={vendor.storeBanner.url} alt="banner" fill className="object-cover opacity-50" />
        )}
        <div className="absolute inset-0 flex items-end p-6">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-xl border-4 border-white bg-white shadow-lg sm:h-20 sm:w-20">
              {vendor.storeLogo?.url
                ? <Image src={vendor.storeLogo.url} alt={vendor.storeName} fill className="object-cover" />
                : <div className="flex h-full w-full items-center justify-center bg-indigo-100 text-2xl font-bold text-indigo-600">
                    {vendor.storeName[0]}
                  </div>}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{vendor.storeName}</h1>
              <p className="text-sm text-indigo-100">Since {formatDate(vendor.createdAt, { year: "numeric", month: "long" })}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="mb-8 grid grid-cols-3 gap-4">
          {[
            { icon: Package,   label: "Products",  value: vendor.totalProducts },
            { icon: ShoppingBag, label: "Orders",  value: vendor.totalOrders   },
            { icon: Star,      label: "Joined",    value: formatDate(vendor.createdAt, { year: "numeric", month: "short" }) },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-xl border border-gray-200 bg-white p-4 text-center">
              <Icon className="mx-auto mb-1 h-5 w-5 text-indigo-600" />
              <p className="text-lg font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          ))}
        </div>

        {/* Description */}
        {vendor.storeDescription && (
          <p className="mb-8 text-gray-600">{vendor.storeDescription}</p>
        )}

        {/* Products */}
        <h2 className="mb-4 text-xl font-bold text-gray-900">Products ({products.length})</h2>
        {products.length === 0 ? (
          <EmptyState icon={<Package className="h-12 w-12" />} title="No products yet" />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
