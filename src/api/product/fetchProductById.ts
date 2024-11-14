import apiClient from "../fakeApiClient";
import { Product } from "@/store/slice/types"; 
// 獲取特定產品
export const fetchProductById = async (id: number): Promise<Product> => {
  const response = await apiClient.get(`/products/${id}`);
    // console.log(response);

  return response.data;
};
