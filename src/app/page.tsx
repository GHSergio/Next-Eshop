// src/app/page.tsx
// "use client";
import React from "react";
import MainContent from "../components/MainContent";
import "../styles/globals.css";
import { fetchAllProducts, fetchAllCategories } from "@/api/";

export const dynamic = "auto"; // 根據頁面設置自動選擇靜態或動態渲染
export const revalidate = 300; // ISR，每 300 秒重新生成

// `page.tsx` 是一個 Server Component
const HomePage = async () => {
  // 在服務器端加載數據
  const [products, categories] = await Promise.all([
    fetchAllProducts(),
    fetchAllCategories(),
  ]);

  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* 將數據作為 props 傳遞給 MainContent */}
      <MainContent products={products} categories={categories} />
    </div>
  );
};

export default HomePage;
