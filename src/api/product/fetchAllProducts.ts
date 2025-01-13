import apiClient from "@/api/dummyApiClient";
import { Product } from "@/types";
// 獲取所有產品
export const fetchAllProducts = async (): Promise<Product[]> => {
  const response = await apiClient.get("/products");
  // console.log(response);

  return response.data.products;
};
