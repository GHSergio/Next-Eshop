"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types";
import { searchProducts } from "@/api";
import SearchBar from "@/components/SearchBar";

const SearchPageContent: React.FC = () => {
  const searchParams = useSearchParams();
  const query = searchParams?.get("q") || "";
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // 排序狀態
  const [sortOption, setSortOption] = useState<string>("rating-desc");

  // 處理排序
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "rating-asc":
        return a.rating - b.rating;
      case "rating-desc":
        return b.rating - a.rating;
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      default:
        return 0;
    }
  });

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) return;

      setLoading(true);
      try {
        const results = await searchProducts(query.trim());
        setFilteredProducts(results);
      } catch (error) {
        console.error("搜索失敗:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-11/12 mx-auto my-5">
      <div className="w-full mx-auto my-8">
        <SearchBar />
      </div>

      <h1 className="text-2xl font-bold mb-6">搜索結果</h1>

      {/* 排序選項 */}
      <div className="mb-4">
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border rounded p-2"
        >
          <option value="rating-desc">按評分（高到低）</option>
          <option value="rating-asc">按評分（低到高）</option>
          <option value="price-desc">按價格（高到低）</option>
          <option value="price-asc">按價格（低到高）</option>
        </select>
      </div>

      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {sortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.title}
              price={product.price}
              image={product.images[0]}
              rating={product.rating}
            />
          ))}
        </div>
      ) : (
        <p className="text-lg">沒有符合的商品</p>
      )}
    </div>
  );
};

export default SearchPageContent;
