export interface ProductImage {
  url:      string;
  publicId: string;
}

export interface ProductRating {
  average: number;
  count:   number;
}

export interface Product {
  _id:           string;
  vendor:        { _id: string; storeName: string; storeLogo: { url: string } };
  title:         string;
  description:   string;
  price:         number;
  discountPrice: number;
  category:      string;
  images:        ProductImage[];
  stock:         number;
  isActive:      boolean;
  ratings:       ProductRating;
  tags:          string[];
  sold:          number;
  isLowStock?:   boolean;
  createdAt:     string;
}

export interface ProductFilters {
  search?:   string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?:     string;
  order?:    "asc" | "desc";
  page?:     number;
  limit?:    number;
}

export interface Pagination {
  total:      number;
  page:       number;
  limit:      number;
  totalPages: number;
}

export interface ProductsResponse {
  products:   Product[];
  pagination: Pagination;
}
