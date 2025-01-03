"use client";
import React, { useEffect, useCallback } from "react";
import SearchBar from "./SearchBar";
import ProductCard from "./ProductCard";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import {
  setSearchQuery,
  // fetchProductsAndCategories,
  selectFilteredProducts,
} from "../store/slice/productSlice";

interface MainContentProps {
  category?: string;
}

const MainContent: React.FC<MainContentProps> = ({ category }) => {
  const dispatch: AppDispatch = useDispatch();
  const loading = useSelector((state: RootState) => state.products.loading);

  // 使用 useCallback 確保這些函數只有在 dispatch 改變時才重新創建
  // const fetchProducts = useCallback(() => {
  //   dispatch(fetchProductsAndCategories());
  // }, [dispatch]);

  const clearSearchQuery = useCallback(() => {
    dispatch(setSearchQuery(""));
  }, [dispatch]);

  // useEffect(() => {
  //   fetchProducts();
  // }, [fetchProducts]);

  useEffect(() => {
    clearSearchQuery();
  }, [category, clearSearchQuery]);

  const filteredProducts = useSelector((state: RootState) =>
    selectFilteredProducts(state, category)
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <div className="w-11/12 mx-auto my-5 flex flex-col">
        {/* Search Bar */}
        <div className="w-full md:w-1/3 lg:w-1/4 mb-4">
          <SearchBar />
        </div>

        {/* 符合結果數量 */}
        <h2 className="text-sm my-4">
          符合的結果為 {filteredProducts.length} 筆
        </h2>

        {/* 商品卡片的容器 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {filteredProducts.length === 0 ? (
            <p className="text-center text-lg col-span-full">
              搜尋不到相關結果
            </p>
          ) : (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                image={product.image}
                title={product.title}
                price={product.price}
                discountPrice={product.discountPrice}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default MainContent;
