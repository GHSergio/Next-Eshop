import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
// import { RootState } from "../store";
// import { createSelector } from "reselect";
import { fetchAllProducts, fetchAllCategories } from "@/api";
import { ProductState, Product, Category } from "@/types";

//定義 狀態 初始值
const initialState: ProductState = {
  products: [],
  categories: [],
  topRatedProducts: [],
  filteredProducts: [],
  loading: true,
  error: null,
  // searchQuery: "",
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
    setProducts(state, action: PayloadAction<Product[]>) {
      state.products = action.payload; // 初始化產品數據
    },
    setCategories(state, action: PayloadAction<Category[]>) {
      state.categories = action.payload; // 初始化分類數據
    },
    // setSearchQuery(state, action: PayloadAction<string>) {
    //   state.searchQuery = action.payload.trim();

    //   // 過濾產品列表，根據搜索條件更新
    //   state.filteredProducts = state.products.filter((product) =>
    //     product.title.toLowerCase().includes(state.searchQuery.toLowerCase())
    //   );
    // },
    setTopRatedProducts(state, action: PayloadAction<Product[]>) {
      state.topRatedProducts = action.payload;
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

// // 依照條件filter
// export const selectFilteredProducts = createSelector(
//   (state: RootState) => state.products.products,
//   (state: RootState) => state.products.searchQuery,
//   (_: RootState, category?: string) => category, // 接受額外的參數 category
//   (products, searchQuery, category) => {
//     // 基於提取的狀態和參數進行計算
//     return products.filter((product) => {
//       const matchesCategory =
//         !category || product.category?.toLowerCase() === category.toLowerCase();
//       const matchesSearch =
//         searchQuery === "" ||
//         product.title.toLowerCase().includes(searchQuery.toLowerCase());
//       return matchesCategory && matchesSearch;
//     });
//   }
// );

// 導出 actions 給元件使用
export const {
  setProducts,
  setCategories,
  // setSearchQuery,
  setTopRatedProducts,
} = productSlice.actions;

// 導出 reducer 給 store 使用
export default productSlice.reducer;
