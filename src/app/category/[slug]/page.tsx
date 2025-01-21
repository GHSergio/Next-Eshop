// "use client";
import React from "react";
import { fetchProductsByCategory } from "@/api";
import SearchBar from "@/components/SearchBar";
import ProductList from "@/components/ProductList";

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params;

  const products = await fetchProductsByCategory(slug);

  return (
    <div className="w-11/12 mx-auto my-5">
      {/* SearchBar */}
      <div className="w-full mx-auto my-8">
        <SearchBar />
      </div>

      <h1 className="text-2xl font-bold mb-6 capitalize">分類: {slug}</h1>

      {/* 將數據傳遞給 ProductList */}
      <ProductList initialProducts={products} />
    </div>
  );
}
