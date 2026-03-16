export interface ShippingAddress {
  fullName:   string;
  phone:      string;
  address:    string;
  city:       string;
  state:      string;
  postalCode: string;
  country:    string;
}

export interface OrderItem {
  product:  { _id: string; title: string; images: { url: string }[] };
  vendor:   { _id: string; storeName: string };
  title:    string;
  image:    string;
  price:    number;
  quantity: number;
}

export type OrderStatus    = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled" | "refunded";
export type PaymentStatus  = "pending" | "paid" | "failed" | "refunded";

export interface Order {
  _id:             string;
  user:            { _id: string; fullName: string; email: string };
  items:           OrderItem[];
  shippingAddress: ShippingAddress;
  subtotal:        number;
  discount:        number;
  total:           number;
  coupon?:         { code: string };
  status:          OrderStatus;
  paymentStatus:   PaymentStatus;
  paymentIntentId: string;
  paidAt:          string;
  deliveredAt?:    string;
  createdAt:       string;
}
