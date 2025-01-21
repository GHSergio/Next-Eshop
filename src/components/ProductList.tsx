// Client Component: ProductList.tsx
"use client";

import React, { useState } from "react";
import { Product } from "@/types";
import ProductCard from "./ProductCard";

interface ProductListProps {
  initialProducts: Product[];
}

export default function ProductList({ initialProducts }: ProductListProps) {
  const [sortOption, setSortOption] = useState<string>("rating-desc");

  // 根據排序選項進行排序
  const sortedProducts = [...initialProducts].sort((a, b) => {
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

  return (
    <div>
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
}
