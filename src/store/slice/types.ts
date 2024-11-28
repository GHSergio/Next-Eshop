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

export interface Address {
  id: string; // 地址 ID
  recipientName: string; // 收件人姓名
  phone: string; // 收件人電話
  addressLine: string; // 具體地址
  city: string; // 城市
  state: string; // 省/州
  postalCode: string; // 郵編
  country: string; // 國家
  isDefault?: boolean; // 是否為默認地址
}

export interface UserInfo {
  // Supabase auth.user 提供的屬性
  id: string; // 用戶唯一識別 ID
  email: string | undefined; // 用戶電子郵件
  // phone?: string | null; // 電話號碼 (可選)
  role?: string; // 用戶角色
  createdAt?: string; // 註冊時間
  lastSignInAt?: string; // 上次登入時間
  isAnonymous?: boolean; // 是否為匿名用戶
  provider?: string; // 身份提供者 (Google, email, etc.)

  // OAuth 特有屬性
  fullName?: string | null; // 全名 (從 OAuth 獲取)
  avatarUrl?: string | null; // 頭像 URL
  emailVerified?: boolean; // 是否驗證信箱 (Supabase auth 可支持)
  phoneVerified?: boolean; // 是否驗證手機

  // 自定義的電商屬性
  phone?: string | null; // 電話號碼 (可選)
  membershipType?: string | null; // 會員類型 (如 premium, basic)
  defaultShippingAddress?: string | null; // 默認收貨地址
  addresses?: string[]; // 存儲多個地址（需要關聯 addresses 表）
  preferredPaymentMethod?: string | null; // 優先支付方式
  updatedAt?: string;
}

// User 狀態接口
export interface UserState {
  isLoggedIn: boolean;
  // isInitialized:boolean;
  userInfo: UserInfo | null;
  cart?: CartItem[];
  ordersHistory?: OrderItem[];
  alert: AlertState;
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
  // cart: CartItem[];
  // showCart: boolean;
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

// Alert
export interface AlertState {
  open: boolean;
  message: string;
  severity: "success" | "error" | "info" | "warning";
}
