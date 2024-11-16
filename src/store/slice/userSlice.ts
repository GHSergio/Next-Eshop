import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import {
  UserState,
  UserInfo,
  CartItem,
  OrderItem,
  RegisterUserPayload,
  LoginUserPayload,
  AlertState,
} from "@/store/slice/types";
import { registerUser, loginUser } from "@/api";
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
};

// register
export const registerUserThunk = createAsyncThunk(
  "user/registerUser",
  async (userData: RegisterUserPayload, { rejectWithValue }) => {
    try {
      const response = await registerUser(userData);
      // 若註冊成功（`status` 為 201 且 `success` 為 true），回傳使用者資料
      console.log("thunk接收到的: ", response);
      if (response.status === 201) {
        console.log("201接收到的: ", response.data);
        return response.data;
      }
    } catch (error: unknown) {
      return rejectWithValue(formatErrorResponse(error));
    }
  }
);

// login
export const loginUserThunk = createAsyncThunk(
  "user/loginUser",
  async (userData: LoginUserPayload, { rejectWithValue }) => {
    try {
      const response = await loginUser(userData);
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
    setIsAuthModalOpen(state, action: PayloadAction<boolean>) {
      state.isAuthModalOpen = action.payload;
    },
    // 登出，清除所有使用者相關資訊
    logout(state) {
      state.userInfo = null;
      state.isLoggedIn = false;
      state.cart = [];
      state.ordersHistory = [];
    },
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
  },
  extraReducers: (builder) => {
    // register
    builder
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        console.log(action.payload);
        const { severity, message } = action.payload as AlertState;
        setAlertState(state, severity, message || "註冊成功");
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        console.log(action.payload);
        const { severity, message } = action.payload as AlertState;
        setAlertState(state, severity, message || "註冊失敗");
      });
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
  },
});

export const {
  setUser,
  logout,
  addToCart,
  removeFromCart,
  updateCartQuantity,
  addOrder,
  setIsAuthModalOpen,
  setAlert,
  clearAlert,
} = userSlice.actions;

export default userSlice.reducer;
