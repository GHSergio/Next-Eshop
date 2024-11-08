import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { fetchAllProducts, fetchAllCategories } from "@/api";
import { createSelector } from "reselect";
import { CartItem, ProductState } from "@/store/slice/types";

// interface CartItem {
//   id: string;
//   image: string;
//   title: string;
//   price: number;
//   quantity: number;
//   color: string;
//   size: string;
// }

// //定義狀態
// interface ProductState {
//   products: Product[];
//   categories: string[];
//   loading: boolean;
//   error: string | null;
//   searchQuery: string;
//   cart: CartItem[];
//   showCart: boolean;
// }

//定義 狀態 初始值
const initialState: ProductState = {
  products: [],
  categories: [],
  loading: true,
  error: null,
  searchQuery: "",
  cart: [
    {
      color: "Red",
      id: "4-Red-S",
      image: "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg",
      price: 15.99,
      quantity: 4,
      size: "S",
      title: "Mens Casual Slim Fit",
    },
    {
      color: "Blue",
      id: "4-Blue-S",
      image: "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg",
      price: 15.99,
      quantity: 4,
      size: "S",
      title: "Mens Casual Slim Fit",
    },
  ],
  showCart: false,
};

// 定義非同步操作 (Thunk)
export const fetchProductsAndCategories = createAsyncThunk(
  // 路徑用來識別這個 Thunk，隨意命名
  "products/fetchProductsAndCategories",
  async () => {
    const [productsData, categoriesData] = await Promise.all([
      fetchAllProducts(),
      fetchAllCategories(),
    ]);
    return { products: productsData, categories: categoriesData };
  }
);

// 創建 Slice
const productSlice = createSlice({
  // Slice 的名稱，用於區分不同的 Slice
  name: "products",
  initialState, // 初始化狀態
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const item = action.payload;
      const existingItem = state.cart.find(
        (cartItem) =>
          cartItem.id === item.id &&
          cartItem.color === item.color &&
          cartItem.size === item.size
      );

      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        state.cart.push(item);
      }
    },
    removeFromCart(
      state,
      action: PayloadAction<{ id: string; color: string; size: string }>
    ) {
      const { id, color, size } = action.payload;
      state.cart = state.cart.filter(
        (item) => item.id !== id || item.color !== color || item.size !== size
      );
    },
    updateCartItemQuantity(
      state,
      action: PayloadAction<{
        id: string;
        color: string;
        size: string;
        quantity: number;
      }>
    ) {
      const { id, color, size, quantity } = action.payload;
      const existingItem = state.cart.find(
        (item) => item.id === id && item.color === color && item.size === size
      );
      if (existingItem) {
        existingItem.quantity = quantity;
      }
    },
    clearCart(state) {
      state.cart = [];
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setShowCart(state, action: PayloadAction<boolean>) {
      state.showCart = action.payload;
    },
    openCart(state) {
      state.showCart = true;
    },
    closeCart(state) {
      state.showCart = false;
    },
  },
  // 處理 Thunk 狀態變化
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsAndCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsAndCategories.fulfilled, (state, action) => {
        state.products = action.payload.products;
        state.categories = action.payload.categories;
        state.loading = false;
      })
      .addCase(fetchProductsAndCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "獲取商品清單 & 分類發生錯誤";
      });
  },
});

// 使用 reselect createSelector 創建記憶化選擇器，優化性能，選擇器會記住上次的計算結果，除非依賴的state改變，否則不會重新計算。 -> 計算購物車中商品的總數量
export const selectCartItemCount = createSelector(
  // 依賴的輸入選擇器
  (state: RootState) => state.products.cart,
  (cart) => {
    // 計算邏輯
    return cart.reduce((total, item) => total + item.quantity, 0);
  }
);

// 依照條件filter
export const selectFilteredProducts = createSelector(
  (state: RootState) => state.products.products,
  (state: RootState) => state.products.searchQuery,
  (_: RootState, category?: string) => category, // 接受額外的參數 category
  (products, searchQuery, category) => {
    // 基於提取的狀態和參數進行計算
    return products.filter((product) => {
      const matchesCategory =
        !category || product.category.toLowerCase() === category.toLowerCase();
      const matchesSearch =
        searchQuery === "" ||
        product.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }
);

// 導出 actions 給元件使用
export const {
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
  setSearchQuery,
  setShowCart,
  openCart,
  closeCart,
} = productSlice.actions;

// 導出 reducer 給 store 使用
export default productSlice.reducer;
