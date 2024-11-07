// src/api/productAPI.ts
import apiClient from "./apiClient";
import { Product } from "./types";

// 獲取所有產品
export const fetchAllProducts = async (): Promise<Product[]> => {
  const response = await apiClient.get("/products");
  return response.data;
};

// 獲取特定產品
export const fetchProductById = async (id: number): Promise<Product> => {
  const response = await apiClient.get(`/products/${id}`);
  return response.data;
};

// 創建新產品
export const createProduct = async (
  product: Omit<Product, "id">
): Promise<Product> => {
  const response = await apiClient.post("/products", product);
  return response.data;
};

// 更新產品
export const updateProduct = async (
  id: number,
  product: Partial<Product>
): Promise<Product> => {
  const response = await apiClient.put(`/products/${id}`, product);
  return response.data;
};

// 刪除產品
export const deleteProduct = async (id: number): Promise<void> => {
  await apiClient.delete(`/products/${id}`);
};
