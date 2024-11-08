import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserState, UserInfo, CartItem, OrderItem } from "@/store/slice/types";

const initialState: UserState = {
  isLoggedIn: false,
  userInfo: null,
  cart: [],
  ordersHistory: [],
  isAuthModalOpen: false,
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
} = userSlice.actions;

export default userSlice.reducer;
