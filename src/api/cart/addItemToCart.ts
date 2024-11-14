// src/api/cart/addItemToCart.ts
import apiClient from "../nextApiClient";

export const addItemToCart = async (item: {
  id: string;
  title: string;
  quantity: number;
  price: number;
}) => {
  const response = await apiClient.post("/cart", item);
  return response;
};
