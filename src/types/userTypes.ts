import { DeliveryInfo, CreditCardInfo, StoreInfo, Errors } from "@/types";
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

// 購物車
export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  product_image: string;
  product_name: string;
  product_price: number;
  color: string;
  size: string;
  quantity: number;
  added_at: string;
  updated_at: string;
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

// 訂單資訊
export interface Order {
  id?: string; // 訂單ID，資料庫生成
  user_id: string;
  total_price: number;
  items_count: number;
  total_items_price: number;
  shipping_cost: number;
  payment_method: string;
  recipient_name: string;
  recipient_phone: string;
  delivery_address?: string | null; // 可空，僅宅配需要
  store_name?: string | null; // 可空，僅超商取貨需要
  status: string;
  created_at: string;
  updated_at: string;
}

// 訂單商品資訊
export interface OrderItem {
  id?: string;
  order_id?: string;
  product_id: string;
  product_name: string;
  product_price: number;
  product_image: string;
  color: string;
  size: string;
  quantity: number;
  subtotal: number;
  created_at: string;
  updated_at: string;
}

// Alert
export interface AlertState {
  open: boolean;
  message: string;
  severity: "success" | "error" | "info" | "warning";
}

export interface UserInfo {
  // Supabase auth.user 提供的屬性
  id: string; // 用戶唯一識別 ID
  email: string | undefined; // 用戶電子郵件
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

export interface CurrentOrderDetails {
  [orderId: string]: {
    order: Order | null;
    items: OrderItem[];
  };
}

// User 狀態接口
export interface UserState {
  isLoggedIn: boolean;
  userInfo: UserInfo | null;
  cart: CartItem[] | [];
  selectedItems: CartItem[] | [];
  selectedPayment: string;
  shippingCost: number;
  deliveryInfo: DeliveryInfo; // 收件人資訊
  creditCardInfo: CreditCardInfo; // 信用卡資訊
  storeInfo: StoreInfo; // 超商取貨資訊
  errors: Errors; // 資訊填寫驗證
  ordersHistory: Order[];
  currentOrderDetails: CurrentOrderDetails; // 使用明確類型
  alert: AlertState;
  showCart: boolean;
  showMember: boolean;
}
