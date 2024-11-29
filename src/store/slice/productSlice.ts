import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { fetchAllProducts, fetchAllCategories } from "@/api";
import { createSelector } from "reselect";
import { ProductState } from "@/store/slice/types";

//定義 狀態 初始值
const initialState: ProductState = {
  products: [],
  categories: [],
  loading: true,
  error: null,
  searchQuery: "",
};

// 定義非同步操作 (Thunk)
export const fetchProductsAndCategories = createAsyncThunk(
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
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
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
// export const selectCartItemCount = createSelector(
//   // 依賴的輸入選擇器
//   (state: RootState) => state.products.cart,
//   (cart) => {
//     // 計算邏輯
//     return cart.reduce((total, item) => total + item.quantity, 0);
//   }
// );

// 依照條件filter
export const selectFilteredProducts = createSelector(
  (state: RootState) => state.products.products,
  (state: RootState) => state.products.searchQuery,
  (_: RootState, category?: string) => category, // 接受額外的參數 category
  (products, searchQuery, category) => {
    // 基於提取的狀態和參數進行計算
    return products.filter((product) => {
      const matchesCategory =
        !category || product.category?.toLowerCase() === category.toLowerCase();
      const matchesSearch =
        searchQuery === "" ||
        product.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }
);

// 導出 actions 給元件使用
export const {
  // addToCart,
  // removeFromCart,
  // updateCartItemQuantity,
  // clearCart,
  setSearchQuery,
  // setShowCart,
  // openCart,
  // closeCart,
} = productSlice.actions;

// 導出 reducer 給 store 使用
export default productSlice.reducer;
