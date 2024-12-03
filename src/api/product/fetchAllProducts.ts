import apiClient from "../fakeApiClient";
import { Product } from "@/types"; 
// 獲取所有產品
export const fetchAllProducts = async (): Promise<Product[]> => {
  const response = await apiClient.get("/products");
    // console.log(response);

  return response.data;
};
