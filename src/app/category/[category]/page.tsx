import React from "react";
import MainContent from "@/components/MainContent";
import { fetchAllCategories, fetchProductsByCategory } from "@/api";

interface CategoryPageProps {
  params: {
    category: string;
  };
}

export const dynamic = "auto"; // 根據頁面設置自動選擇靜態或動態渲染
export const revalidate = 300; // ISR，每 300 秒重新生成

export async function generateStaticParams() {
  // 從 API 獲取所有分類
  const categories = await fetchAllCategories();
  return categories.map((category) => ({
    category: encodeURIComponent(category), // 確保 URL 安全
  }));
}

const CategoryPage: React.FC<CategoryPageProps> = async ({ params }) => {
  const category = decodeURIComponent(params.category);

  // 獲取該分類的商品數據
  const products = await fetchProductsByCategory(category);

  return (
    <div className="min-h-screen w-full flex flex-col">
      {/* 將數據作為 props 傳遞給 MainContent */}
      <MainContent products={products} category={category} />
    </div>
  );
};

export default CategoryPage;
