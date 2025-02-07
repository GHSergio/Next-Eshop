import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import {
  UserState,
  UserInfo,
  CartItem,
  Order,
  OrderInput,
  OrderItem,
  AlertState,
  CreditCardInfo,
  AddressItem,
  InsertAddressItem,
  StoreItem,
  InsertStoreItem,
} from "@/types";
import { supabase } from "@/supabaseClient";
import { RootState, AppDispatch } from "@/store/store";

interface RejectValue {
  message: string;
  severity: "success" | "error" | "info" | "warning";
}

const initialState: UserState = {
  isLoggedIn: false,
  // isInitialized: false,
  userInfo: null,
  cart: [],
  ordersHistory: [],
  currentOrderDetails: {},
  addresses: [],
  stores: [],

  selectedItems: [],
  selectedPayment: "",
  shipping_cost: 0,

  activeStep: 0, // 預設為第 0 步
  isOrderSubmitted: false,
  shouldReset: false,

  // 收件資訊表格
  delivery_info: {
    id: "",
    user_id: "",
    recipient_name: "",
    phone: "",
    // email: "",
    city: "",
    district: "",
    address_line: "",
    is_default: false,
  },
  // 信用卡資訊表格
  creditCard_info: {
    user_id: "",
    card_number: "",
    expiry_date: "",
    cvv: "",
  },
  // 門市資訊表格
  store_info: {
    id: "",
    user_id: "",
    recipient_name: "",
    phone: "",
    c_store: "",
    city: "",
    district: "",
    road_section: "",
    store_name: "",
    store_address: "",
    is_default: false,
  },

  errors: {
    delivery: {
      recipient_name: true,
      phone: true,
      city: true,
      district: true,
      address_line: true,
    },
    creditCard: {
      card_number: true,
      expiry_date: true,
      cvv: true,
    },
    store: {
      recipient_name: true,
      phone: true,
      c_store: true,
      city: true,
      district: true,
      road_section: true,
      store_name: true,
      // store_address: true,
    },
  },
  alert: {
    open: false,
    message: "",
    severity: "info",
  },
  showCart: false,
  showMember: false,
  // 表單驗證是否通過
  isDeliveryFormValid: false,
  isStoreFormValid: false,
  isCreditCardFormValid: false,
  // emailVerified: false,
  isAddAddressModalOpen: false,
  isAddStoreModalOpen: false,
};

// 登入
export const loginUserThunk = createAsyncThunk<
  void,
  { email: string; password: string },
  { rejectValue: RejectValue }
>("user/loginUser", async ({ email, password }, { rejectWithValue }) => {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    // console.log(error?.message);

    if (error) {
      // console.log("Supabase 錯誤回應：", error); // 檢查 error 結構
      if (error.message === "Invalid login credentials") {
        return rejectWithValue({
          message: "登入失敗：帳號或密碼不正確！",
          severity: "error",
        });
      } else if (error.message === "Email not confirmed") {
        return rejectWithValue({
          message: "登入失敗：您的信箱尚未驗證，請先完成驗證！",
          severity: "warning",
        });
      }
      return rejectWithValue({
        message: "登入失敗：" + error.message,
        severity: "error",
      });
    }

    // 登入成功的處理
    // SDK會自動setItem 所以只設置通知
    return;
  } catch (error: unknown) {
    // 處理未知錯誤並返回 rejectValue
    console.log(error);
    return rejectWithValue({
      message: "發生未知錯誤，請稍後再試！",
      severity: "error",
    });
  }
});

export const loginWithGoogleThunk = createAsyncThunk<
  void,
  void,
  { rejectValue: RejectValue }
>("user/loginWithGoogle", async (_, { rejectWithValue }) => {
  try {
    // 啟動 Google OAuth 流程
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) {
      console.error("Google 登入失敗：", error.message);
      return rejectWithValue({ message: error.message, severity: "error" });
    }
  } catch (error) {
    console.error("Google 登入失敗：", error);
    return rejectWithValue({
      message: "Google 登入失敗，請稍後再試。",
      severity: "error",
    });
  }
});

// 定義初始化用戶數據的 thunk
// export const initializeUserThunk = createAsyncThunk<
//   void,
//   string,
//   { rejectValue: string }
// >("user/initializeUserThunk", async (authId, { rejectWithValue }) => {
//   try {
//     // 檢查用戶是否已存在於 table 中
//     const { data, error } = await supabase
//       .from("users")
//       .select("*")
//       .eq("auth_id", authId)
//       .maybeSingle();

//     if (error) {
//       console.error("檢查用戶數據失敗：", error.message);
//       return rejectWithValue("檢查用戶數據失敗");
//     }

//     // 如果數據不存在，插入新數據
//     if (!data) {
//       const { error: insertError } = await supabase.from("users").insert({
//         auth_id: authId,
//         membership_type: "普通會員",
//         user_name: "",
//         avatar_url: "",
//         phone: null,
//         default_shipping_address: null,
//         default_pickup_store: null,
//         // preferred_payment_method: null,
//       });

//       if (insertError) {
//         console.error("初始化用戶數據失敗：", insertError.message);
//         return rejectWithValue("初始化用戶數據失敗");
//       } else {
//         console.log("用戶數據已初始化");
//       }
//     } else {
//       // table數據已存在，
//       console.log("用戶數據已存在，跳過初始化");
//     }
//   } catch (error: unknown) {
//     console.error("初始化用戶數據時發生錯誤：", error);
//     return rejectWithValue("初始化用戶數據時發生錯誤");
//   }
// });

export const initializeUserThunk = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>("user/initializeUserThunk", async (authId, { rejectWithValue }) => {
  try {
    const { data, error: fetchError } = await supabase
      .from("users")
      .select("id")
      .eq("auth_id", authId)
      .maybeSingle();

    if (fetchError) {
      console.error("檢查用戶數據失敗：", fetchError.message);
      return rejectWithValue("檢查用戶數據失敗");
    }

    if (data) {
      console.log("用戶數據已存在，跳過初始化");
      return;
    }

    // **使用 upsert() 來確保不會發生 409 Conflict**
    const { error: insertError } = await supabase.from("users").upsert([
      {
        auth_id: authId,
        membership_type: "普通會員",
        user_name: null,
        avatar_url: "",
        phone: null,
        default_shipping_address: null,
        default_pickup_store: null,
      },
    ]);

    if (insertError) {
      console.error("初始化用戶數據失敗：", insertError.message);
      return rejectWithValue("初始化用戶數據失敗");
    }

    console.log("用戶數據已初始化");
  } catch (error: unknown) {
    console.error("初始化用戶數據時發生錯誤：", error);
    return rejectWithValue("初始化用戶數據時發生錯誤");
  }
});

// 登出 Thunk
export const logoutUserThunk = createAsyncThunk<
  void,
  void,
  { rejectValue: RejectValue }
>("user/logoutUser", async (_, { rejectWithValue, dispatch }) => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return rejectWithValue({
        message: "登出失敗：" + error.message,
        severity: "error",
      });
    }
    // 成功登出後清理 localStorage 並重置 Redux 狀態
    localStorage.clear();
    // 重置 Redux 狀態
    dispatch(clearUserInfo());
  } catch (error: unknown) {
    console.log(error);
    return rejectWithValue({
      message: "發生未知錯誤，請稍後再試！",
      severity: "error",
    });
  }
});

// 獲取用戶 DB 資訊
export const fetchUserData = createAsyncThunk<
  UserInfo, // 返回的數據類型
  void, // 無需傳入參數
  { rejectValue: RejectValue }
>("user/fetchUserData", async (_, { rejectWithValue, getState }) => {
  const state = getState() as RootState;

  // 如果 UserInfo 已存在，避免多餘的請求
  if (state.user.userInfo) {
    return state.user.userInfo;
  }
  try {
    // 獲取 auth.user 部分
    const { data: session, error } = await supabase.auth.getSession();
    if (error || !session?.session?.user) {
      return rejectWithValue({
        message: "用戶未登入或會話已過期",
        severity: "error",
      });
    }

    const supabaseUserInfo = session.session.user;

    // 獲取自定義部分，聯結 addresses 和 stores 表
    const { data: customUserInfo, error: customError } = await supabase
      .from("users")
      .select(
        `
    *,
    default_shipping_address:addresses!users_default_shipping_address_fkey(*),
    default_pickup_store:stores!users_default_pickup_store_fkey(*)
  `
      )
      .eq("auth_id", supabaseUserInfo.id)
      .maybeSingle(); // 改用 maybeSingle()，避免空結果時報錯

    // 發生錯誤
    if (customError) {
      console.log(customUserInfo, customError);
      return rejectWithValue({
        message: "無法獲取用戶自定義信息",
        severity: "error",
      });
    }

    // 合併 映射 auth.user & user
    const userInfo: UserInfo = {
      id: supabaseUserInfo.id,
      email: supabaseUserInfo.email || "",
      avatar_url:
        customUserInfo?.avatar_url ||
        supabaseUserInfo.user_metadata?.avatar_url ||
        "",
      user_name: customUserInfo?.user_name || "",
      phone: customUserInfo?.phone,
      // 預設收件地址格式
      default_shipping_address: customUserInfo?.default_shipping_address
        ? {
            id: customUserInfo.default_shipping_address.id,
            user_id: customUserInfo.default_shipping_address.auth_id,
            recipient_name:
              customUserInfo.default_shipping_address.recipient_name,
            phone: customUserInfo.default_shipping_address.phone,
            city: customUserInfo.default_shipping_address.city,
            district: customUserInfo.default_shipping_address.district,
            address_line: customUserInfo.default_shipping_address.address_line,
            is_default: customUserInfo.default_shipping_address.is_default,
          }
        : null,
      // 預設取貨門市格式
      default_pickup_store: customUserInfo?.default_pickup_store
        ? {
            id: customUserInfo.default_pickup_store.id,
            user_id: customUserInfo.default_pickup_store.auth_id,
            recipient_name: customUserInfo.default_pickup_store.recipient_name,
            phone: customUserInfo.default_pickup_store.phone,
            c_store: customUserInfo.default_pickup_store.c_store,
            city: customUserInfo.default_pickup_store.city,
            district: customUserInfo.default_pickup_store.district,
            road_section: customUserInfo.default_pickup_store.road_section,
            // store: {
            //   store_name: customUserInfo.default_pickup_store.store_name,
            //   store_address: customUserInfo.default_pickup_store.store_address,
            // },
            store_name: customUserInfo.default_pickup_store.store_name,
            store_address: customUserInfo.default_pickup_store.store_address,
            is_default: customUserInfo.default_pickup_store.is_default,
          }
        : null,
      provider: supabaseUserInfo.app_metadata?.provider,
      updated_at: customUserInfo?.updated_at || null,
    };

    // 存入 localStorage
    localStorage.setItem("userData", JSON.stringify(userInfo));
    return userInfo;
  } catch (error) {
    console.error(error);
    return rejectWithValue({
      message: "獲取用戶信息失敗，請稍後再試！",
      severity: "error",
    });
  }
});

// // 修改使用者資訊
// export const updateUserDataThunk = createAsyncThunk<
//   void,
//   { field: keyof UserInfo; value: UserInfo[keyof UserInfo] | null }, // 使用 keyof UserInfo 限制字段
//   { state: RootState; rejectValue: string } // 訪問 Redux 狀態
// >(
//   "user/updateUserData",
//   async ({ field, value }, { rejectWithValue, getState }) => {
//     try {
//       const state = getState();
//       const authId = state.user.userInfo?.id; // 從狀態中獲取 authId

//       if (!authId) {
//         throw new Error("無法獲取用戶 ID，請重新登入");
//       }

//       const { error } = await supabase
//         .from("users")
//         .update({ [field]: value }) // 更新指定字段
//         .eq("auth_id", authId); // 對象為與authId一樣的auth_id的項目

//       if (error) throw error;
//     } catch (error) {
//       console.error("更新用戶字段失敗", error);
//       return rejectWithValue("更新失敗，請稍後再試");
//     }
//   }
// );

// 獲取用戶 DB 購物車數據
export const fetchCartThunk = createAsyncThunk<
  CartItem[], // 返回的數據類型
  string, // 傳入的用戶 ID
  { rejectValue: string }
>("cart/fetchCart", async (authId, { rejectWithValue }) => {
  try {
    const { data, error } = await supabase
      .from("cart_items")
      .select("*")
      .eq("auth_id", authId);

    if (error) {
      return rejectWithValue("獲取購物車數據失敗：" + error.message);
    }
    // 更新本地存儲
    localStorage.setItem("cart", JSON.stringify(data || []));
    return (data as CartItem[]) || [];
  } catch (error) {
    console.error("獲取購物車數據時發生錯誤：", error);
    return rejectWithValue("獲取購物車數據時發生未知錯誤");
  }
});

// 添加購物車項目
export const addToCartThunk = createAsyncThunk<
  CartItem, // 返回類型
  CartItem, // 傳入完整的商品數據
  { rejectValue: string }
>("cart/addToCart", async (cartItem, { rejectWithValue }) => {
  try {
    const { data, error } = await supabase
      .from("cart_items")
      .insert({
        auth_id: cartItem.user_id,
        product_id: cartItem.product_id,
        product_name: cartItem.product_name,
        product_price: cartItem.product_price,
        product_image: cartItem.product_image,
        color: cartItem.color,
        size: cartItem.size,
        quantity: cartItem.quantity,
        added_at: new Date().toISOString(),
      })
      .select("*")
      .single();

    if (error) {
      return rejectWithValue("添加到購物車失敗：" + error.message);
    }

    return data as CartItem;
  } catch (error) {
    console.error("添加購物車項目時發生錯誤：", error);
    return rejectWithValue("添加購物車時發生未知錯誤");
  }
});

// 更新購物車數據
export const updateCartItemThunk = createAsyncThunk<
  CartItem, // 返回的數據類型
  Partial<CartItem> & { id: string }, // 傳入的更新數據類型
  { rejectValue: string }
>("cart/updateCartItem", async (updatedItem, { rejectWithValue }) => {
  try {
    const { id, ...updateData } = updatedItem;
    const { data, error } = await supabase
      .from("cart_items")
      .update(updateData) // 之後可能可以更改 尺寸/顏色?
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      return rejectWithValue("更新購物車項目失敗：" + error.message);
    }

    return data as CartItem;
  } catch (error) {
    console.error("更新購物車項目時發生錯誤：", error);
    return rejectWithValue("更新購物車項目時發生未知錯誤");
  }
});

// 刪除購物車項目
export const deleteCartItemThunk = createAsyncThunk<
  string, // 返回刪除的項目 ID
  string, // 傳入的項目 ID
  { rejectValue: string }
>("cart/deleteCartItem", async (cartItemId, { rejectWithValue }) => {
  try {
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", cartItemId);

    if (error) {
      return rejectWithValue("刪除購物車項目失敗：" + error.message);
    }

    return cartItemId; // 返回已刪除的項目 ID
  } catch (error) {
    console.error("刪除購物車項目時發生錯誤：", error);
    return rejectWithValue("刪除購物車項目時發生未知錯誤");
  }
});

// 新增訂單
export const saveOrderThunk = createAsyncThunk<
  Order, // 返回 Order 類型
  { newOrder: OrderInput; orderItems: OrderItem[] }, // 傳入的參數類型
  { rejectValue: string }
>("orders/saveOrder", async ({ newOrder, orderItems }, { rejectWithValue }) => {
  try {
    // 插入到 `orders` 表
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert(newOrder) // 插入數據，newOrder 沒有 id
      .select() // 返回插入後的完整數據，包括生成的 id
      .single();

    if (orderError) {
      return rejectWithValue("儲存訂單失敗：" + orderError.message);
    }

    // 將 `orderItems` 插入到 `order_items` 表
    const enrichedOrderItems = orderItems.map((item) => ({
      ...item,
      order_id: orderData.id, // 關聯剛生成的訂單ID
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(enrichedOrderItems);

    if (itemsError) {
      return rejectWithValue("儲存訂單商品失敗：" + itemsError.message);
    }

    return orderData as Order;
  } catch (error) {
    console.log(error);
    return rejectWithValue("儲存訂單時發生未知錯誤");
  }
});

// 獲取訂單紀錄
export const fetchOrdersThunk = createAsyncThunk<
  Order[], // 返回值類型
  string, // 傳入的 user_id
  { rejectValue: string }
>("orders/fetchOrders", async (userId, { rejectWithValue }) => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("auth_id", userId); // 在orders內 尋找auth_id 符合userId的項目

    if (error) {
      return rejectWithValue("獲取訂單失敗：" + error.message);
    }

    return data as Order[];
  } catch (error) {
    console.error("獲取歷史訂單時發生錯誤：", error);
    return rejectWithValue("發生未知錯誤，無法獲取訂單");
  }
});

// 獲取訂單詳細資訊
export const fetchOrderDetailsThunk = createAsyncThunk<
  { order: Order; items: OrderItem[] }, // 返回訂單主檔和商品明細
  string, // 傳入 order_id
  { rejectValue: string }
>("orders/fetchOrderDetails", async (orderId, { rejectWithValue }) => {
  try {
    // 獲取訂單主檔
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId) // 在orders內 尋找id 符合orderId的項目
      .single();

    if (orderError) {
      return rejectWithValue("獲取訂單主檔失敗：" + orderError.message);
    }

    // 獲取訂單的商品明細
    const { data: itemsData, error: itemsError } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", orderId);

    if (itemsError || !itemsData) {
      console.error("訂單商品明細查詢失敗：", itemsError?.message);
      return rejectWithValue(
        `獲取訂單商品失敗：${itemsError?.message || "未知錯誤"}`
      );
    }

    // 返回訂單主檔和商品明細
    return {
      order: orderData as Order,
      items: itemsData as OrderItem[],
    };
  } catch (error) {
    console.log(error);
    return rejectWithValue("發生未知錯誤，無法獲取訂單詳情");
  }
});

// 新增收貨地址 Thunk
export const saveAddressThunk = createAsyncThunk<
  AddressItem, // 返回值類型
  InsertAddressItem, // 傳入參數類型
  { rejectValue: string }
>("addresses/save", async (addressData, { rejectWithValue }) => {
  try {
    const { data, error } = await supabase
      .from("addresses")
      .insert({
        auth_id: addressData.user_id,
        recipient_name: addressData.recipient_name,
        phone: addressData.phone,
        city: addressData.city,
        district: addressData.district,
        address_line: addressData.address_line,
        is_default: addressData.is_default,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select("*")
      .single();

    if (error) {
      return rejectWithValue(`儲存地址失敗: ${error.message}`);
    }
    console.log("常用地址儲存成功", data);
    return data as AddressItem;
  } catch (error) {
    console.error(error);
    return rejectWithValue("儲存地址時發生未知錯誤");
  }
});

// 獲取收貨地址 Thunk
export const fetchAddressesThunk = createAsyncThunk<
  AddressItem[], // 返回值類型
  string, // user_id
  { rejectValue: string }
>("addresses/fetch", async (userId, { rejectWithValue }) => {
  try {
    const { data, error } = await supabase
      .from("addresses")
      .select("*")
      .eq("auth_id", userId);

    if (error) {
      return rejectWithValue(`獲取地址失敗: ${error.message}`);
    }

    // console.log("常用地址獲取成功", data);
    return data || [];
  } catch (error) {
    console.error(error);
    return rejectWithValue("獲取地址時發生未知錯誤");
  }
});

// 移除地址 Thunk
export const deleteAddressThunk = createAsyncThunk<
  string, // 返回被刪除的地址 ID
  string, // 傳入的地址 ID 和用戶 ID
  { dispatch: AppDispatch; rejectValue: string } //
>("user/deleteAddress", async (addressId, { dispatch, rejectWithValue }) => {
  try {
    // 從 localStorage 獲取 user_id
    const userData = localStorage.getItem("userData");
    const authId = userData ? JSON.parse(userData).id : null;
    if (!authId) {
      return rejectWithValue("無法找到用戶 ID，請重新登入");
    }

    const { error } = await supabase
      .from("addresses")
      .delete()
      .eq("id", addressId);

    if (error) {
      return rejectWithValue(`刪除地址失敗: ${error.message}`);
    }
    // 刪除成功後重新獲取地址列表 -> 避免選擇地址時 未更新select
    dispatch(fetchAddressesThunk(authId));
    return addressId; // 成功返回刪除的地址 ID
  } catch (error) {
    console.error("刪除地址時發生錯誤:", error);
    return rejectWithValue("刪除地址時發生未知錯誤");
  }
});

// 新增取貨門市 Thunk
export const saveStoreThunk = createAsyncThunk<
  StoreItem, // 返回值類型
  InsertStoreItem, // 傳入參數類型
  { rejectValue: string }
>("stores/save", async (storeData, { rejectWithValue }) => {
  try {
    const { data, error } = await supabase
      .from("stores")
      .insert({
        auth_id: storeData.user_id,
        recipient_name: storeData.recipient_name,
        phone: storeData.phone,
        c_store: storeData.c_store,
        city: storeData.city,
        district: storeData.district,
        road_section: storeData.road_section,
        store_name: storeData.store_name,
        store_address: storeData.store_address,
        is_default: storeData.is_default,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select("*")
      .single();

    if (error) {
      return rejectWithValue(`儲存門市失敗: ${error.message}`);
    }

    // console.log("常用門市儲存成功", data);
    return data as StoreItem;
  } catch (error) {
    console.error(error);
    return rejectWithValue("儲存門市時發生未知錯誤");
  }
});

// 獲取門市 Thunk
export const fetchStoresThunk = createAsyncThunk<
  StoreItem[], // 返回值類型
  string, // auth_id
  { rejectValue: string }
>("stores/fetch", async (userId, { rejectWithValue }) => {
  try {
    const { data, error } = await supabase
      .from("stores")
      .select("*")
      .eq("auth_id", userId);

    if (error) {
      return rejectWithValue(`獲取門市失敗: ${error.message}`);
    }

    // 將資料轉換為應用程式所需的格式
    const storesData = (data || []).map((store) => ({
      ...store,
    }));

    // console.log("常用門市獲取成功", data);
    return storesData || [];
  } catch (error) {
    console.error(error);
    return rejectWithValue("獲取門市時發生未知錯誤");
  }
});

// 移除門市 thunk
export const deleteStoreThunk = createAsyncThunk<
  string, // 返回被刪除的門市 ID
  string, // 傳入的門市 ID
  { dispatch: AppDispatch; rejectValue: string }
>("user/deleteStore", async (storeId, { dispatch, rejectWithValue }) => {
  try {
    // 從 localStorage 獲取 user_id
    const userData = localStorage.getItem("userData");
    const authId = userData ? JSON.parse(userData).id : null;
    if (!authId) {
      return rejectWithValue("無法找到用戶 ID，請重新登入");
    }

    const { error } = await supabase.from("stores").delete().eq("id", storeId);

    if (error) {
      return rejectWithValue(`刪除門市失敗: ${error.message}`);
    }
    // 刪除成功後重新獲取地址列表 -> 避免選擇門市時 未更新select
    dispatch(fetchStoresThunk(authId));
    return storeId; // 成功返回刪除的門市 ID
  } catch (error) {
    console.error("刪除門市時發生錯誤:", error);
    return rejectWithValue("刪除門市時發生未知錯誤");
  }
});

// 格式化 axios errorResponse
// export const formatErrorResponse = (error: unknown) => {
//   if (axios.isAxiosError(error) && error.response) {
//     const status = error.response.status;
//     const message = error.response.data?.message || "發生未知錯誤";
//     const severity = error.response.data?.severity || "error";
//     return {
//       status,
//       message,
//       severity,
//     };
//   } else {
//     // 處理非 Axios 錯誤
//     return {
//       status: 500,
//       message: "伺服器發生錯誤，請稍後再試",
//       severity: "error",
//     };
//   }
// };

// 通用的 Alert 處理函式
const setAlertState = (
  state: UserState,
  severity: AlertState["severity"],
  message: string
) => {
  state.alert = {
    open: true,
    severity,
    message,
  };
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // 設置使用者資訊和登入狀態
    setUser(state, action: PayloadAction<UserInfo>) {
      state.userInfo = action.payload;
    },
    // 設置是否顯示登入Modal
    setIsLoggedIn(state, action: PayloadAction<boolean>) {
      state.isLoggedIn = action.payload;
    },
    // 選中商品
    setSelectedItems(state, action: PayloadAction<CartItem[]>) {
      state.selectedItems = action.payload;
    },
    // 結帳步驟
    setActiveStep(state, action: PayloadAction<number>) {
      console.log("Step現在到底是: ", action.payload);
      state.activeStep = action.payload; // 強制轉為數字類型
    },
    // 重置Order
    resetOrder(state) {
      console.log("正在重置訂單狀態...");
      state.activeStep = 0;
      state.selectedItems = [];
      state.selectedPayment = "";
      state.store_info = initialState.store_info;
      state.delivery_info = initialState.delivery_info;
      state.creditCard_info = initialState.creditCard_info;
      state.isOrderSubmitted = false;
      console.log("狀態重置完成：", state);
    },
    // 控制是否需要在首頁執行 reset
    setShouldReset(state, action: PayloadAction<boolean>) {
      state.shouldReset = action.payload;
    },
    // 是否最後步驟
    setIsOrderSubmitted(state, action: PayloadAction<boolean>) {
      state.isOrderSubmitted = action.payload;
    },
    // 選擇支付方式
    setSelectedPayment(state, action: PayloadAction<string>) {
      state.selectedPayment = action.payload;
    },
    // 運費
    setShippingCost(state, action: PayloadAction<number>) {
      state.shipping_cost = action.payload;
    },
    // 設置超商取貨資訊
    setStoreInfo(state, action: PayloadAction<StoreItem>) {
      state.store_info = action.payload;
    },
    // 設置收件人資訊
    setDeliveryInfo(state, action: PayloadAction<AddressItem>) {
      state.delivery_info = action.payload;
    },
    // 設置信用卡資訊
    setCreditCardInfo(state, action: PayloadAction<CreditCardInfo>) {
      state.creditCard_info = action.payload;
    },
    // 設置驗證
    setErrors(state, action) {
      state.errors = {
        ...state.errors,
        ...action.payload, // 合併新錯誤對象
      };
    },

    // 宅配表單驗證結果
    setDeliveryValidity(state, action: PayloadAction<boolean>) {
      state.isDeliveryFormValid = action.payload;
    },
    // 門市表單驗證結果
    setStoreValidity(state, action: PayloadAction<boolean>) {
      state.isStoreFormValid = action.payload;
    },
    // 信用卡表單驗證結果
    setCreditCardValidity(state, action: PayloadAction<boolean>) {
      state.isCreditCardFormValid = action.payload;
    },
    // 重置表單驗證結果
    resetFormValidity(state, action: PayloadAction<boolean>) {
      state.isDeliveryFormValid = action.payload;
      state.isStoreFormValid = action.payload;
      state.isCreditCardFormValid = action.payload;
    },
    // Alert
    setAlert(state, action: PayloadAction<AlertState>) {
      state.alert = action.payload;
    },
    clearAlert(state) {
      state.alert = { open: false, message: "", severity: "info" };
    },
    // Cart Dropdown
    setShowCart(state, action: PayloadAction<boolean>) {
      state.showCart = action.payload;
    },
    // toggle Cart Dropdown
    toggleCart(state) {
      state.showCart = !state.showCart;
    },
    // Member Dropdown
    setShowMember(state, action: PayloadAction<boolean>) {
      state.showMember = action.payload;
    },
    // toggle Memeber Dropdown
    toggleMember(state) {
      state.showMember = !state.showMember;
    },
    // CreateDelivery Modal
    setIsAddAddressModalOpen(state, action: PayloadAction<boolean>) {
      state.isAddAddressModalOpen = action.payload;
    },
    // CreateStore Modal
    setIsAddStoreModalOpen(state, action: PayloadAction<boolean>) {
      state.isAddStoreModalOpen = action.payload;
    },

    // loginOut 清除使用者資訊
    clearUserInfo(state) {
      state.userInfo = null;
    },
  },
  extraReducers: (builder) => {
    // 一般 & 遊客 登入
    builder
      .addCase(loginUserThunk.fulfilled, (state) => {
        state.isLoggedIn = true;
        setAlertState(state, "success", "用戶登入成功！");
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        console.log("rejected 收到什麼:", action.payload);
        const { message, severity } = action.payload as RejectValue; // 明確告訴 TypeScript payload 是 RejectValue
        setAlertState(state, severity, message);
      });
    // Google 登入
    builder
      .addCase(loginWithGoogleThunk.fulfilled, (state, action) => {
        console.log(action.payload);
        state.isLoggedIn = true;
        setAlertState(state, "success", "用戶登入成功！");
      })
      .addCase(loginWithGoogleThunk.rejected, (state, action) => {
        console.log("rejected 收到什麼:", action.payload);
        const { message, severity } = action.payload as RejectValue;
        setAlertState(state, severity, message);
      });
    // 登出
    builder
      .addCase(logoutUserThunk.fulfilled, (state) => {
        setAlertState(state, "success", "用戶登出成功！");
        state.cart = [];
      })
      .addCase(logoutUserThunk.rejected, (state, action) => {
        console.log("logout rejected:", action.payload);
        const { message, severity } = action.payload as RejectValue;
        setAlertState(state, severity, message);
      });
    // 獲取使用者資訊
    builder
      .addCase(fetchUserData.fulfilled, (state, action) => {
        console.log("fetch user data:", action.payload);
        state.userInfo = action.payload;
        state.isLoggedIn = true;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        const { message, severity } = action.payload as RejectValue;
        setAlertState(state, severity, message);
      });
    // 添加購物車項目
    builder
      .addCase(addToCartThunk.fulfilled, (state, action) => {
        state.cart = [...state.cart, action.payload];
      })
      .addCase(addToCartThunk.rejected, (state, action) => {
        // setAlertState(state, "error", "購物車商品添加失敗！");
        console.error("添加商品失敗", action.payload);
      });

    // 獲取購物車項目
    builder
      .addCase(fetchCartThunk.fulfilled, (state, action) => {
        console.log("購物車資訊", action.payload);
        state.cart = action.payload;
      })
      .addCase(fetchCartThunk.rejected, (_, action) => {
        console.error("獲取購物車資訊失敗", action.payload);
        // setAlertState(state, "error", "購物車商品獲取失敗！");
      });

    // 更新購物車項目 && 也要更新被選中的商品 -> CartFooter是根據SelectedItems狀態變動
    builder
      .addCase(updateCartItemThunk.fulfilled, (state, action) => {
        if (state.cart) {
          const index = state.cart.findIndex(
            (item) => item.id === action.payload.id
          );

          // 更新 cart 中的項目
          if (index !== -1) {
            state.cart[index] = action.payload;
          }

          // 同步更新 selectedItems 中的項目
          const selectedIndex = state.selectedItems.findIndex(
            (item) => item.id === action.payload.id
          );

          if (selectedIndex !== -1) {
            state.selectedItems[selectedIndex] = action.payload;
          }
          setAlertState(state, "success", "更改成功！");
        }
      })
      .addCase(updateCartItemThunk.rejected, (state, action) => {
        // setAlertState(state, "error", "購物車商品更新失敗！");
        console.error("商品數量更新失敗", action.payload);
      });

    // 刪除購物車項目
    builder
      .addCase(deleteCartItemThunk.fulfilled, (state, action) => {
        state.cart = state.cart?.filter((item) => item.id !== action.payload);
        // setAlertState(state, "success", "移除商品成功！");
        console.log("移除商品成功");
      })
      .addCase(deleteCartItemThunk.rejected, (state, action) => {
        console.error("移除商品失敗", action.payload);
        // setAlertState(state, "error", "移除商品失敗！");
      });
    // 獲取訂單紀錄
    builder
      .addCase(fetchOrdersThunk.fulfilled, (state, action) => {
        console.log("獲取訂單紀錄成功", action.payload);
        state.ordersHistory = action.payload;
      })
      .addCase(fetchOrdersThunk.rejected, (state, action) => {
        console.error("獲取訂單紀錄失敗", action.payload);
      });
    // 獲取訂單詳細資訊
    builder
      .addCase(
        fetchOrderDetailsThunk.fulfilled,
        (
          state,
          action: PayloadAction<{ order: Order; items: OrderItem[] }>
        ) => {
          console.log("獲取訂單詳細資訊成功", action.payload);
          const { order, items } = action.payload;
          if (order.id) {
            // 使用 order.id 作為鍵
            state.currentOrderDetails[order.id] = { order, items };
            console.log(state.currentOrderDetails);
          }
          // else {
          //   console.error("訂單沒有 ID，無法更新 currentOrderDetails");
          // }
        }
      )
      .addCase(fetchOrderDetailsThunk.rejected, (state, action) => {
        console.error("獲取訂單詳細資訊失敗", action.payload);
      });

    // 儲存訂單
    builder
      .addCase(saveOrderThunk.fulfilled, (state, action) => {
        console.log("儲存訂單成功", action.payload);
        state.ordersHistory = [...state.ordersHistory, action.payload];
        state.store_info = {
          id: "",
          user_id: "",
          recipient_name: "",
          phone: "",
          c_store: "",
          city: "",
          district: "",
          road_section: "",
          store_name: "",
          store_address: "",
          is_default: false,
        };
        state.delivery_info = {
          id: "",
          user_id: "",
          recipient_name: "",
          phone: "",
          city: "",
          district: "",
          address_line: "",
          is_default: false,
        };
        state.creditCard_info = {
          user_id: "",
          card_number: "",
          expiry_date: "",
          cvv: "",
        };
      })
      .addCase(saveOrderThunk.rejected, (state, action) => {
        console.error("儲存訂單失敗", action.payload);
      });
    // 新增常用門市
    builder
      .addCase(saveStoreThunk.fulfilled, (state, action) => {
        console.log("新增門市成功: ", action.payload);
        state.stores = [...state.stores, action.payload];
      })
      .addCase(saveStoreThunk.rejected, (state, action) => {
        console.error("新增門市失敗: ", action.payload);
      });
    // 新增常用地址
    builder
      .addCase(saveAddressThunk.fulfilled, (state, action) => {
        console.log("新增地址成功: ", action.payload);
        state.addresses = [...state.addresses, action.payload];
      })
      .addCase(saveAddressThunk.rejected, (state, action) => {
        console.error("新增地址失敗: ", action.payload);
      });
    // 獲取常用門市
    builder
      .addCase(fetchStoresThunk.fulfilled, (state, action) => {
        console.log("獲取常用門市成功", action.payload);
        state.stores = action.payload;
      })
      .addCase(fetchStoresThunk.rejected, (state, action) => {
        console.error("獲取常用門市失敗: ", action.payload);
      });
    // 獲取常用地址
    builder
      .addCase(fetchAddressesThunk.fulfilled, (state, action) => {
        console.log("獲取常用地址成功 ", action.payload);
        state.addresses = action.payload;
      })
      .addCase(fetchAddressesThunk.rejected, (state, action) => {
        console.error("獲取常用地址失敗: ", action.payload);
      });
    // 移除常用地址
    builder.addCase(deleteAddressThunk.fulfilled, (state, action) => {
      state.addresses = state.addresses.filter(
        (address) => address.id !== action.payload
      );
      console.log("地址移除成功");
    });

    // 移除常用門市
    builder.addCase(deleteStoreThunk.fulfilled, (state, action) => {
      state.stores = state.stores.filter(
        (store) => store.id !== action.payload
      );
      console.log("門市移除成功");
    });
    // 修改使用者資訊
    // builder
    //   .addCase(updateUserDataThunk.fulfilled, (state, action) => {
    //     const { field, value } = action.meta.arg; // 獲取傳入的字段及其值
    //     if (state.userInfo) {
    //       // 確保 field 是 UserInfo 的鍵
    //       state.userInfo[field as keyof UserInfo] = value as never;
    //     }
    //     setAlertState(state, "success", "更新成功！");
    //   })
    //   .addCase(updateUserDataThunk.rejected, (state, action) => {
    //     console.error("更新用戶字段失敗", action.payload);
    //     setAlertState(
    //       state,
    //       "error",
    //       action.payload || "更新失敗，請稍後再試！"
    //     );
    //   });
  },
});

export const {
  setUser,
  setIsLoggedIn,
  clearUserInfo,
  setSelectedItems,
  setSelectedPayment,

  setActiveStep,
  resetOrder,
  setIsOrderSubmitted,
  setShouldReset,

  setShippingCost,
  setStoreInfo,
  setDeliveryInfo,
  setCreditCardInfo,
  setDeliveryValidity,
  setStoreValidity,
  setCreditCardValidity,
  resetFormValidity,
  setErrors,
  setAlert,
  clearAlert,
  setShowCart,
  toggleCart,
  setShowMember,
  toggleMember,
  setIsAddAddressModalOpen,
  setIsAddStoreModalOpen,
} = userSlice.actions;

export default userSlice.reducer;
