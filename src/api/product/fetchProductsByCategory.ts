import apiClient from "../fakeApiClient";
import { Product } from "@/store/slice/types"; 
// 獲取特定類別的產品
export const fetchProductsByCategory = async (
  category: string
): Promise<Product[]> => {
  const response = await apiClient.get(`/products/category/${category}`);
  // console.log(response);

  return response.data;
};
