// ─── API Base ─────────────────────────────────────────────────────
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

// ─── API Routes ───────────────────────────────────────────────────
export const API_ROUTES = {
  // Auth
  AUTH: {
    REGISTER:        "/auth/register",
    LOGIN:           "/auth/login",
    LOGOUT:          "/auth/logout",
    REFRESH_TOKEN:   "/auth/refresh-token",
    ME:              "/auth/me",
    CHANGE_PASSWORD: "/auth/change-password",
    UPDATE_PROFILE:  "/auth/update-profile",
  },
  // Vendor
  VENDOR: {
    SETUP:     "/vendors/setup",
    ME:        "/vendors/me",
    UPDATE:    "/vendors/update",
    DASHBOARD: "/vendors/dashboard",
    EARNINGS:  "/vendors/earnings",
    STORE:     (vendorId: string) => `/vendors/store/${vendorId}`,
  },
  // Products
  PRODUCTS: {
    BASE:          "/products",
    BY_ID:         (id: string) => `/products/${id}`,
    MY_PRODUCTS:   "/products/vendor/my-products",
    UPDATE_STOCK:  (id: string) => `/products/${id}/stock`,
    DELETE_IMAGE:  (productId: string, publicId: string) => `/products/${productId}/images/${publicId}`,
  },
  // Cart
  CART: {
    BASE:          "/cart",
    ADD:           "/cart/add",
    ITEM:          (productId: string) => `/cart/item/${productId}`,
    CLEAR:         "/cart/clear",
    APPLY_COUPON:  "/cart/apply-coupon",
    REMOVE_COUPON: "/cart/remove-coupon",
  },
  // Orders
  ORDERS: {
    PAYMENT_INTENT: "/orders/payment-intent",
    PLACE:          "/orders/place",
    MY_ORDERS:      "/orders/my-orders",
    VENDOR_ORDERS:  "/orders/vendor-orders",
    BY_ID:          (id: string) => `/orders/${id}`,
    CANCEL:         (id: string) => `/orders/${id}/cancel`,
    STATUS:         (id: string) => `/orders/${id}/status`,
  },
  // Reviews
  REVIEWS: {
    BASE:           "/reviews",
    BY_PRODUCT:     (productId: string) => `/reviews/product/${productId}`,
    MY_REVIEWS:     "/reviews/my-reviews",
    BY_ID:          (id: string) => `/reviews/${id}`,
  },
  // Coupons
  COUPONS: {
    BASE:     "/coupons",
    VALIDATE: (code: string) => `/coupons/validate/${code}`,
    BY_ID:    (id: string) => `/coupons/${id}`,
  },
  // Admin
  ADMIN: {
    STATS:           "/admin/stats",
    USERS:           "/admin/users",
    TOGGLE_USER:     (id: string) => `/admin/users/${id}/toggle`,
    VENDORS:         "/admin/vendors",
    APPROVE_VENDOR:  (id: string) => `/admin/vendors/${id}/approve`,
    SUSPEND_VENDOR:  (id: string) => `/admin/vendors/${id}/suspend`,
    ORDERS:          "/admin/orders",
    PRODUCTS:        "/admin/products",
    REMOVE_PRODUCT:  (id: string) => `/admin/products/${id}`,
    DELETE_REVIEW:   (id: string) => `/admin/reviews/${id}`,
  },
} as const;

// ─── App Routes ───────────────────────────────────────────────────
export const APP_ROUTES = {
  HOME:        "/",
  LOGIN:       "/login",
  REGISTER:    "/register",
  PRODUCTS:    "/products",
  PRODUCT:     (id: string) => `/products/${id}`,
  CART:        "/cart",
  CHECKOUT:    "/checkout",
  ORDERS:      "/orders",
  ORDER:       (id: string) => `/orders/${id}`,
  STORE:       (vendorId: string) => `/store/${vendorId}`,
  PROFILE:     "/profile",
  // Vendor
  VENDOR: {
    DASHBOARD: "/vendor/dashboard",
    PRODUCTS:  "/vendor/products",
    ADD:       "/vendor/products/add",
    EDIT:      (id: string) => `/vendor/products/edit/${id}`,
    ORDERS:    "/vendor/orders",
    EARNINGS:  "/vendor/earnings",
    SETTINGS:  "/vendor/settings",
  },
  // Admin
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    USERS:     "/admin/users",
    VENDORS:   "/admin/vendors",
    PRODUCTS:  "/admin/products",
    ORDERS:    "/admin/orders",
    COUPONS:   "/admin/coupons",
  },
} as const;

// ─── User Roles ───────────────────────────────────────────────────
export const USER_ROLES = {
  CUSTOMER: "customer",
  VENDOR:   "vendor",
  ADMIN:    "admin",
} as const;

// ─── Order Status ─────────────────────────────────────────────────
export const ORDER_STATUS = {
  PENDING:   "pending",
  CONFIRMED: "confirmed",
  SHIPPED:   "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
  REFUNDED:  "refunded",
} as const;

export const ORDER_STATUS_COLORS: Record<string, string> = {
  pending:   "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped:   "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  refunded:  "bg-gray-100 text-gray-800",
};

// ─── Payment Status ───────────────────────────────────────────────
export const PAYMENT_STATUS_COLORS: Record<string, string> = {
  pending:  "bg-yellow-100 text-yellow-800",
  paid:     "bg-green-100 text-green-800",
  failed:   "bg-red-100 text-red-800",
  refunded: "bg-gray-100 text-gray-800",
};

// ─── Vendor Status ────────────────────────────────────────────────
export const VENDOR_STATUS_COLORS: Record<string, string> = {
  pending:   "bg-yellow-100 text-yellow-800",
  approved:  "bg-green-100 text-green-800",
  suspended: "bg-red-100 text-red-800",
};

// ─── Low Stock Threshold ──────────────────────────────────────────
export const LOW_STOCK_THRESHOLD = 5;

// ─── Pagination ───────────────────────────────────────────────────
export const DEFAULT_PAGE_SIZE = 12;

// ─── Product Categories ───────────────────────────────────────────
export const PRODUCT_CATEGORIES = [
  "electronics",
  "accessories",
  "clothing",
  "shoes",
  "books",
  "home",
  "beauty",
  "sports",
  "toys",
  "food",
  "other",
] as const;

// ─── Sort Options ─────────────────────────────────────────────────
export const SORT_OPTIONS = [
  { label: "Newest",       value: "createdAt", order: "desc" },
  { label: "Oldest",       value: "createdAt", order: "asc"  },
  { label: "Price: Low",   value: "price",     order: "asc"  },
  { label: "Price: High",  value: "price",     order: "desc" },
  { label: "Top Rated",    value: "ratings.average", order: "desc" },
  { label: "Best Selling", value: "sold",      order: "desc" },
] as const;

// ─── Stripe ───────────────────────────────────────────────────────
export const STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";