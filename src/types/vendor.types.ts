export type VendorStatus = "pending" | "approved" | "suspended";

export interface Vendor {
  _id:              string;
  user:             { _id: string; fullName: string; email: string; avatar: { url: string } };
  storeName:        string;
  storeDescription: string;
  storeLogo:        { url: string; publicId: string };
  storeBanner:      { url: string; publicId: string };
  status:           VendorStatus;
  totalEarnings:    number;
  totalOrders:      number;
  totalProducts:    number;
  bankDetails:      { accountName: string; accountNumber: string; bankName: string };
  createdAt:        string;
}

export interface VendorDashboard {
  storeName:        string;
  status:           VendorStatus;
  totalEarnings:    number;
  totalOrders:      number;
  totalProducts:    number;
  lowStockProducts: number;
  recentOrders:     unknown[];
}

export interface MonthlyEarning {
  month:    string;
  earnings: number;
}
