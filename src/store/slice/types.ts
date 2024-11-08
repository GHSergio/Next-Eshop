// src/types/globalTypes.ts
import { Product } from "@/api";

// 共用
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
  name: string;
  email: string;
}

// User 狀態接口
export interface UserState {
  isLoggedIn: boolean;
  userInfo: UserInfo | null;
  cart: CartItem[];
  orders: OrderItem[]; // 用於存儲用戶的訂單列表
  isAuthModalOpen: boolean;
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

// UI 狀態接口
export interface UIState {
  isAuthModalOpen: boolean;
  isLoading: boolean; //
}

// 訂單數據接口
export interface OrderItem {
  orderId: string;
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

// AppState：包含所有 slice 狀態的接口（可選）
export interface AppState {
  user: UserState;
  products: ProductState;
  ui: UIState;
  orders: OrderState;
}
