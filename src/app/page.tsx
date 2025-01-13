// src/app/page.tsx
import React from "react";
import "../styles/globals.css";
import { fetchAllCategories } from "@/api/";
import MainContent from "../components/MainContent";
// import SearchBar from "@/components/SearchBar";

export const dynamic = "auto"; // 根據頁面設置自動選擇靜態或動態渲染
export const revalidate = 300; // ISR，每 300 秒重新生成

// `page.tsx` 是一個 Server Component
const HomePage: React.FC = async () => {
  // 在服務器端加載數據
  const categories = await fetchAllCategories();

  // 獲取分類數據;
  // console.log("Categories:", categories);

  return (
    <div className="w-11/12 mx-auto my-5">
      <MainContent categories={categories} />
    </div>
  );
};

export default HomePage;
