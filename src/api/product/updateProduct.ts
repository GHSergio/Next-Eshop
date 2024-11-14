import apiClient from "../fakeApiClient";
import { Product } from "@/store/slice/types"; 
export const updateProduct = async (
  id: number,
  product: Partial<Product>
): Promise<Product> => {
  const response = await apiClient.put(`/products/${id}`, product);
  return response.data;
};
