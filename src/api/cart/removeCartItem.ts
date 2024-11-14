// src/api/cart/removeCartItem.ts
import apiClient from "../nextApiClient";

export const removeCartItem = async (productId: string) => {
  const response = await apiClient.delete(`/cart/${productId}`);
  return response;
};
