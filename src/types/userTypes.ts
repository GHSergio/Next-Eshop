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

// 獲取收貨地址
export interface AddressItem {
  id: string; // 訂單ID，資料庫生成
  user_id: string;
  recipient_name: string;
  phone: string;
  city: string;
  district: string;
  // postal_code: string; // 郵編
  address_line: string; // 具體地址
  is_default: boolean; // 是否為默認地址
}
// 新增收貨地址
export interface InsertAddressItem {
  user_id: string;
  recipient_name: string;
  phone: string;
  city: string;
  district: string;
  // postal_code: string; // 郵編
  address_line: string; // 具體地址
  is_default: boolean; // 是否為默認地址
}

// 獲取取貨門市
export interface StoreItem {
  id: string; // 訂單ID，資料庫生成
  user_id: string;
  recipient_name: string;
  phone: string;
  c_store: string; // 超商類型
  city: string;
  district: string;
  road_section: string;
  store_name: string;
  store_address: string;
  is_default: boolean;
}
// 新增取貨門市
export interface InsertStoreItem {
  user_id: string;
  recipient_name: string;
  phone: string;
  c_store: string;
  city: string;
  district: string;
  road_section: string;
  // store: {
  //   store_name: string;
  //   store_address: string;
  // };
  store_name: string;
  store_address: string;
  is_default: boolean;
}

// 新增訂單
export interface OrderInput {
  auth_id: string;
  total_price: number;
  items_count: number;
  total_items_price: number;
  shipping_cost: number;
  // payment_method: string;
  recipient_name: string;
  recipient_phone: string;
  delivery_address?: string | null; // 可空，僅宅配需要
  c_store?: string; // 可空，僅超取需要
  store_name?: string;
  store_address?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

// 獲取訂單
export interface Order {
  id: string; // 訂單ID，資料庫生成
  auth_id: string;
  total_price: number;
  items_count: number;
  total_items_price: number;
  shipping_cost: number;
  payment_method: string;
  recipient_name: string;
  recipient_phone: string;
  delivery_address?: string | null; // 可空，僅宅配需要
  c_store?: string; // 可空，僅超取需要
  store_name?: string;
  store_address?: string;
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
  created_at?: string; // 註冊時間
  lastSignIn_at?: string; // 上次登入時間
  is_anonymous?: boolean; // 是否為匿名用戶
  provider?: string; // 身份提供者 (Google, email, etc.)

  // OAuth 特有屬性
  user_name?: string | null; // 全名 (從 OAuth 獲取)
  avatar_url?: string | null; // 頭像 URL
  email_verified?: boolean; // 是否驗證信箱 (Supabase auth 可支持)
  phone_verified?: boolean; // 是否驗證手機

  // 自定義的電商屬性
  phone?: string | null; // 電話號碼 (可選)
  membership_type?: string | null; // 會員類型 (如 premium, basic)
  default_shipping_address?: AddressItem | null; // 默認收貨地址
  // addresses?: AddressItem[]; // 存儲多個地址（需要關聯 addresses 表）
  default_pickup_store?: StoreItem | null; // 默認取貨門市
  default_credit_card?: string; // 默認支付
  // stores?: StoreItem[]; // 存儲多個門市（需要關聯 stores 表）
  preferred_payment_method?: string | null; // 優先支付方式
  updated_at?: string;
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
  ordersHistory: Order[];
  currentOrderDetails: CurrentOrderDetails; // 使用明確類型
  addresses: AddressItem[]; // 存儲多個地址（需要關聯 addresses 表）
  stores: StoreItem[]; // 存儲多個門市（需要關聯 stores 表）
  // credit_card: string; // 預設擴充支付方式
  selectedItems: CartItem[] | [];
  selectedPayment: string;
  shipping_cost: number;
  // delivery_info: DeliveryInfo; // 收件人資訊
  // creditCard_info: CreditCardInfo; // 信用卡資訊
  // store_info: StoreInfo; // 超商取貨資訊
  store_info: StoreItem; // 超商取貨資訊
  delivery_info: AddressItem; // 收件人資訊
  creditCard_info: CreditCardInfo; // 信用卡資訊
  errors: Errors; // 資訊填寫驗證

  alert: AlertState;
  showCart: boolean;
  showMember: boolean;
  isDeliveryFormValid: boolean;
  isStoreFormValid: boolean;
  isCreditCardFormValid: boolean;

  isAddAddressModalOpen: boolean;
  isAddStoreModalOpen: boolean;
}
