export interface User {
  _id:       string;
  fullName:  string;
  email:     string;
  role:      "customer" | "vendor" | "admin";
  avatar:    { url: string; publicId: string };
  isActive:  boolean;
  createdAt: string;
}

export interface AuthState {
  user:         User | null;
  accessToken:  string | null;
  refreshToken: string | null;
  isLoading:    boolean;
  isAuth:       boolean;
}

export interface RegisterPayload {
  fullName: string;
  email:    string;
  password: string;
  role:     "customer" | "vendor" | "admin";
  avatar?:  File;
}

export interface LoginPayload {
  email:    string;
  password: string;
}

export interface AuthResponse {
  user:         User;
  accessToken:  string;
  refreshToken?: string;
}
