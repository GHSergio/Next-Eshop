// src/api/cart/fetchCartItems.ts
import apiClient from "../nextApiClient";

export const fetchCartItems = async () => {
  const response = await apiClient.get("/cart");
  return response;
};
