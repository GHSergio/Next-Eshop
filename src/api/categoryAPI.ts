// src/api/categoryAPI.ts
import apiClient from "./apiClient";
import { Product } from "./types";

// 獲取所有類別
export const fetchAllCategories = async (): Promise<string[]> => {
  const response = await apiClient.get("/products/categories");
  return response.data;
};

// 獲取特定類別的產品
export const fetchProductsByCategory = async (
  category: string
): Promise<Product[]> => {
  const response = await apiClient.get(`/products/category/${category}`);
  return response.data;
};
