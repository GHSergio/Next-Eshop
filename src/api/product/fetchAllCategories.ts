import { cache } from "react";
import apiClient from "@/api/dummyApiClient";
import { Category } from "@/types";
import { fetchProductsByCategory } from "@/api";

export const fetchAllCategories = cache(async (): Promise<Category[]> => {
  // 獲取分類列表，返回格式包含 slug, name, url
  const response = await apiClient.get<Category[]>("/products/categories");
  const categories = response.data;

  // 遍歷分類列表，獲取每個分類的第一個商品的圖片
  return await Promise.all(
    categories.map(async (category) => {
      try {
        // 使用 category.url 獲取該分類下的商品
        const products = await fetchProductsByCategory(category.slug);

        // 提取第一個商品的圖片
        const image =
          products?.[0]?.images?.[0] ||
          "https://via.placeholder.com/150?text=No+Image";

        return {
          slug: category.slug, // 分類的 slug
          name: category.name, // 保留返回的分類名稱
          url: category.url, // API 提供的 URL
          image, // 分類圖片
        };
      } catch (error) {
        console.error(`Error fetching category ${category.slug}:`, error);

        return {
          slug: category.slug,
          name: category.name,
          url: category.url,
          image: "https://via.placeholder.com/150?text=No+Image", // 如果出錯，提供默認圖片
        };
      }
    })
  );
});
