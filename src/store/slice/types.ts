// src/types/globalTypes.ts

// 註冊
export interface RegisterUserPayload {
  email: string;
  password: string;
}

// 登入
export interface LoginUserPayload {
  email: string;
  password: string;
}

export interface Product {
  id: number;
  title: string;
  image: string;
  price: number;
  description: string;
  category?: string;
  colors?: string[];
  sizes?: string[];
  rating?: {
    rate: number;
    count: number;
  };
  discountPrice?: number;
}

// 購物車
export interface CartItem {
  id: string;
  image: string;
  title: string;
  price: number;
  quantity: number;
  color: string;
  size: string;
}

// 使用者資料
export interface UserInfo {
  id: string;
  email: string;
  password?: string;
  phone?: string;
  address?: string;
  creditCardLast4?: string;
}

// User 狀態接口
export interface UserState {
  isLoggedIn: boolean;
  userInfo: UserInfo | null;
  cart: CartItem[];
  ordersHistory: OrderItem[];
  isAuthModalOpen: boolean;
  alert: AlertState;
  // emailVerified: boolean;
  showCart: boolean;
  showMember: boolean;
}

// Product 狀態接口
export interface ProductState {
  products: Product[];
  categories: string[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  cart: CartItem[];
  showCart: boolean;
}

// 訂單數據接口
export interface OrderItem {
  id: string;
  items: CartItem[];
  totalAmount: number;
  date: string;
  status: string; // e.g., "pending", "completed", "canceled"
}

// 訂單狀態接口
export interface OrderState {
  orders: OrderItem[];
  loading: boolean;
  error: string | null;
}

// export interface severityItem {
//   severity: "success" | "error" | "info" | "warning";
// }

// Alert
export interface AlertState {
  open: boolean;
  message: string;
  // severity: severityItem;
  severity: "success" | "error" | "info" | "warning";
}

// // UI 狀態接口
// export interface UIState {
//   isAuthModalOpen: boolean;
//   isLoading: boolean; //
// }

// // AppState：包含所有 slice 狀態的接口（可選）
// export interface AppState {
//   user: UserState;
//   products: ProductState;
//   ui: UIState;
//   orders: OrderState;
// }
