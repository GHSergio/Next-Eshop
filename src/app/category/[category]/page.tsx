import React from "react";
import MainContent from "@/components/MainContent";

interface CategoryPageProps {
  params: {
    category: string;
  };
}

const CategoryPage: React.FC<CategoryPageProps> = ({ params }) => {
  // 將 category 解碼，處理 URL 編碼問題
  const category = decodeURIComponent(params.category);

  return (
    <div className="min-h-screen w-full flex flex-col">
      <MainContent category={category} />
    </div>
  );
};

export default CategoryPage;
