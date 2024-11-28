import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import {
  UserState,
  UserInfo,
  CartItem,
  OrderItem,
  AlertState,
} from "@/store/slice/types";
import { supabase } from "@/supabaseClient";
import { RootState } from "@/store/store";

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
  alert: {
    open: false,
    message: "",
    severity: "info",
  },
  showCart: false,
  showMember: false,
  // emailVerified: false,
};

// // register
// export const registerUserThunk = createAsyncThunk(
//   "user/registerUser",
//   async (userData: RegisterUserPayload, { rejectWithValue }) => {
//     try {
//       const response = await registerUser(userData);
//       // 若註冊成功（`status` 為 201 且 `success` 為 true），回傳使用者資料
//       console.log("thunk接收到的: ", response);
//       if (response.status === 201) {
//         console.log("201接收到的: ", response.data);
//         return response.data;
//       }
//     } catch (error: unknown) {
//       return rejectWithValue(formatErrorResponse(error));
//     }
//   }
// );

// login

// 登入
export const loginUserThunk = createAsyncThunk<
  void,
  { email: string; password: string },
  { rejectValue: RejectValue }
>("user/loginUser", async ({email,password}, { rejectWithValue }) => {
  try {
    const { error } = await supabase.auth.signInWithPassword({email,password});
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
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });

    if (error) {
      console.error("Google 登入失敗：", error.message);
      return rejectWithValue({ message: error.message, severity: "error" });
    }
   
  } catch (error) {
    console.error("Google 登入失敗：", error);
    return rejectWithValue({ message: "Google 登入失敗，請稍後再試。", severity: "error" });
  }
});


// 定義初始化用戶數據的 thunk
export const initializeUserThunk = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>("user/initializeUserThunk", async (authId, { rejectWithValue }) => {
  try {
    // 檢查用戶是否已存在於 table 中
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("auth_id", authId)
      .maybeSingle();

    if (error) {
      console.error("檢查用戶數據失敗：", error.message);
      return rejectWithValue("檢查用戶數據失敗");
    }

    // 如果數據不存在，插入新數據
    if (!data) {
      const { error: insertError } = await supabase.from("users").insert({
        auth_id: authId,
        membership_type: "普通會員",
        username: "",
        avatar_url: "",
        phone:null,
        address: null,
        preferred_payment_method:  null,
        default_shipping_address:  null,
      });

      if (insertError) {
        console.error("初始化用戶數據失敗：", insertError.message);
        return rejectWithValue("初始化用戶數據失敗");
      } else {
        console.log("用戶數據已初始化");
      }
    } else {
      // table數據已存在，
      console.log("用戶數據已存在，跳過初始化");
    }

  } catch (error:unknown) {
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

// fetchUserProfile
export const fetchUserData = createAsyncThunk<
  UserInfo,
  void,
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

    // 獲取自定義部分
    const { data: customUserInfo, error: customError } = await supabase
      .from("users")
      .select("*")
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
      avatarUrl:
        customUserInfo?.avatar_url ||
        supabaseUserInfo.user_metadata?.avatar_url ||
        "",
      fullName: customUserInfo?.username || "",
      phone: customUserInfo?.phone,
      defaultShippingAddress: customUserInfo?.defaultShippingAddress,
      preferredPaymentMethod: customUserInfo?.preferredPaymentMethod,
      membershipType: customUserInfo?.membershipType,
      provider: supabaseUserInfo.app_metadata?.provider,
      updatedAt: customUserInfo?.updated_at || null,
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
    // // 登出，清除所有使用者相關資訊
    // logout(state) {
    //   state.userInfo = null;
    //   // state.isLoggedIn = false;
    //   // state.cart = [];
    //   // state.ordersHistory = [];
    //   localStorage.clear();
    // },
    // 添加商品至購物車
    addToCart(state, action: PayloadAction<CartItem>) {
      const item = action.payload;
      const existingItem = state.cart.find(
        (cartItem) => cartItem.id === item.id
      );
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        state.cart.push(item);
      }
    },
    // 從購物車移除商品
    removeFromCart(state, action: PayloadAction<string>) {
      state.cart = state.cart.filter((item) => item.id !== action.payload);
    },
    // 更新購物車中的商品數量
    updateCartQuantity(
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) {
      const { id, quantity } = action.payload;
      const item = state.cart.find((cartItem) => cartItem.id === id);
      if (item && quantity > 0) {
        item.quantity = quantity;
      }
    },
    // 新增訂單
    addOrder(state, action: PayloadAction<OrderItem>) {
      state.ordersHistory.push(action.payload);
      state.cart = []; // 清空購物車
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
    // Member Dropdown
    setShowMember(state, action: PayloadAction<boolean>) {
      state.showMember = action.payload;
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
        state.isLoggedIn = true
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
        state.isLoggedIn = true
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
  },
});

export const {
  setUser,
  setIsLoggedIn,
  clearUserInfo,
  addToCart,
  removeFromCart,
  updateCartQuantity,
  addOrder,
  setAlert,
  clearAlert,
  setShowCart,
  setShowMember,
} = userSlice.actions;

export default userSlice.reducer;
