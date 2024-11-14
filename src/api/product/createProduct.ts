import apiClient from "../fakeApiClient";
import { Product } from "@/store/slice/types";
// 創建新產品
export const createProduct = async (
  product: Omit<Product, "id">
): Promise<Product> => {
  const response = await apiClient.post("/products", product);
  console.log(response);

  return response.data;
};
