"use client";
import React, { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types";
import { fetchProductsByCategory } from "@/api";
import SearchBar from "@/components/SearchBar";

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

const CategoryPage: React.FC<CategoryPageProps> = ({ params }) => {
  const { slug } = params;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortOption, setSortOption] = useState<string>("rating-desc");

  // 獲取分類商品數據
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await fetchProductsByCategory(slug);
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Failed to fetch category products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  // 排序商品
  const sortedProducts = [...products].sort((a, b) => {
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-11/12 mx-auto my-5">
      {/* SearchBar */}
      <div className="w-full mx-auto my-8">
        <SearchBar />
      </div>

      <h1 className="text-2xl font-bold mb-6 capitalize">分類: {slug}</h1>

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
    </div>
  );
};

export default CategoryPage;
