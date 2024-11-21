import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import {
  UserState,
  UserInfo,
  CartItem,
  OrderItem,
  // RegisterUserPayload,
  LoginUserPayload,
  AlertState,
} from "@/store/slice/types";
import axios from "axios";

const initialState: UserState = {
  isLoggedIn: false,
  userInfo: null,
  cart: [],
  ordersHistory: [],
  isAuthModalOpen: false,
  alert: {
    open: false,
    message: "",
    severity: "info",
  },
  // emailVerified: false,
  showCart: false,
  showMember: true,
};

// 檢查 檢查信箱 是否已存在auth.user
export const checkEmailThunk = createAsyncThunk(
  "user/checkEmail",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/auth/check-user", { email });
      return {
        exists: response.data.exists,
        emailVerified: response.data.emailVerified,
        message: response.data.message,
      };
    } catch (error: unknown) {
      return rejectWithValue(formatErrorResponse(error));
    }
  }
);

// 將信箱添加到auth.user & 發送認證信 onClick認證使用者
export const sendVerifyThunk = createAsyncThunk(
  "user/sendEmail",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/auth/send-email", { email });
      console.log(response);
      return response.data.message;
    } catch (error: unknown) {
      return rejectWithValue(formatErrorResponse(error));
    }
  }
);

// export const syncUserStatus = createAsyncThunk(
//   "user/syncUserStatus",
//   async (_, { rejectWithValue }) => {
//     try {
//       const { data: session, error } = await supabase.auth.getSession();

//       if (error) {
//         throw new Error(error.message);
//       }

//       if (session?.session?.user) {
//         const user = session.session.user;
//         return {
//           id: user.id,
//           email: user.email,
//           emailVerified: !!user.email_confirmed_at, // 驗證狀態
//         };
//       }

//       return {
//         id: null,
//         email: null,
//         emailVerified: false,
//       };
//     } catch (error: any) {
//       return rejectWithValue({
//         message: error.message || "獲取用戶狀態失敗",
//       });
//     }
//   }
// );

// register
// export const registerUserThunk = createAsyncThunk(
//   "user/registerUser",
//   async (userData: RegisterUserPayload, { rejectWithValue }) => {
//     try {
//       // 調用後端 API
//       const response = await axios.post("/api/auth/register", userData);
//       if (response.status === 201) {
//         console.log("201接收到的: ", response.data.data);
//         return response.data.data;
//       }
//     } catch (error: unknown) {
//       // 捕獲異常，並格式化錯誤信息
//       console.error("API 調用異常:", error);
//       return rejectWithValue(formatErrorResponse(error));
//     }
//   }
// );
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
export const loginUserThunk = createAsyncThunk(
  "user/loginUser",
  async (userData: LoginUserPayload, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/auth/login", userData);
      console.log("thunk接收到的: ", response);
      if (response.status === 200) {
        console.log("200接收到的: ", response.data);
        return response.data;
      }
    } catch (error: unknown) {
      return rejectWithValue(formatErrorResponse(error));
    }
  }
);

// fetchUserProfile
export const fetchUserProfile = createAsyncThunk(
  "user/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/users/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "獲取用戶資訊失敗");
      }

      return data.data; // 返回用戶資料
    } catch (error: unknown) {
      return rejectWithValue(formatErrorResponse(error));
    }
  }
);

// 格式化errorResponse
export const formatErrorResponse = (error: unknown) => {
  if (axios.isAxiosError(error) && error.response) {
    const status = error.response.status;
    const message = error.response.data?.message || "發生未知錯誤";
    const severity = error.response.data?.severity || "error";
    return {
      status,
      message,
      severity,
    };
  } else {
    // 處理非 Axios 錯誤
    return {
      status: 500,
      message: "伺服器發生錯誤，請稍後再試",
      severity: "error",
    };
  }
};

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
      state.isLoggedIn = true;
    },
    // 設置是否顯示登入Modal
    setIsLoggedIn(state, action: PayloadAction<boolean>) {
      state.isLoggedIn = action.payload;
    },
    // 登出，清除所有使用者相關資訊
    logout(state) {
      state.userInfo = null;
      state.isLoggedIn = false;
      state.cart = [];
      state.ordersHistory = [];
    },
    // // 重置 emailVerified
    // resetEmailVerified(state) {
    //   state.emailVerified = false; // 重置 emailVerified
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
  },
  extraReducers: (builder) => {
    // // register
    // builder
    //   .addCase(registerUserThunk.fulfilled, (state, action) => {
    //     console.log(action.payload);
    //     const { severity, message } = action.payload as AlertState;
    //     setAlertState(state, severity, message || "註冊成功");
    //   })
    //   .addCase(registerUserThunk.rejected, (state, action) => {
    //     console.log(action.payload);
    //     const { severity, message } = action.payload as AlertState;
    //     setAlertState(state, severity, message || "註冊失敗");
    //   });
    // login
    builder
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        console.log(action.payload);
        state.isLoggedIn = true;
        state.userInfo = action.payload;
        const { severity, message } = action.payload as AlertState;
        setAlertState(state, severity, message || "登入成功");
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        console.log(action.payload);
        const { severity, message } = action.payload as AlertState;
        setAlertState(state, severity, message || "登入失敗");
      });
    // emailVerified
    builder
      .addCase(sendVerifyThunk.fulfilled, (state, action) => {
        const { message } = action.payload as AlertState;
        setAlertState(state, "info", message || "已發送認證信");
      })
      .addCase(sendVerifyThunk.rejected, (state, action) => {
        const { message } = action.payload as AlertState;
        setAlertState(state, "error", message || "發送認證信失敗");
      });

    // 在 Reducer 中處理同步用戶狀態
    // builder.addCase(syncUserStatus.fulfilled, (state, action) => {
    //   state.emailVerified = action.payload;
    // });

    // builder
    //   .addCase(checkEmailThunk.fulfilled, (state, action) => {
    //     state.emailVerified = action.payload.emailVerified;
    //     state.alert = {
    //       open: true,
    //       severity: "info",
    //       message: action.payload.message || "檢查完成",
    //     };
    //   })
    //   .addCase(checkEmailThunk.rejected, (state, action) => {
    //     setAlertState(state, "error", "檢查失敗");
    //   });
  },
});

export const {
  setUser,
  setIsLoggedIn,
  logout,
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
