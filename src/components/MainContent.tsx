"use client";
import React, { useEffect } from "react";
import SearchBar from "./SearchBar";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { Product, Category } from "@/types";
import { setProducts, setCategories } from "@/store/slice/productSlice";
import CategoryCard from "@/components/CategoryCard";

interface MainContentProps {
  products?: Product[];
  categories?: Category[];
  category?: string;
}

const MainContent: React.FC<MainContentProps> = ({
  products,
  categories,
  // category,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const loading = useSelector((state: RootState) => state.products.loading);

  // 在客戶端初始化 Redux store
  useEffect(() => {
    if (!products || !categories) return;
    dispatch(setProducts(products)); // 將產品數據存入 Redux
    dispatch(setCategories(categories)); // 將分類數據存入 Redux
  }, [dispatch, products, categories]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // console.log("Filtered Products:", filteredProducts);

  return (
    <>
      <div className="w-11/12 mx-auto">
        {/* SearchBar */}
        <div className="w-full mx-auto my-8">
          <SearchBar />
        </div>

        {/* 顯示分類卡片 */}
        <h1 className="text-2xl font-bold mb-6">所有分類</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {categories?.map((category) => (
            <CategoryCard
              key={category.slug}
              name={category.name}
              slug={category.slug}
              url={category.url}
              image={category.image}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default MainContent;
