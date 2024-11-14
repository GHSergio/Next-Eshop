// src/api/orders/fetchOrderById.ts
import apiClient from "../nextApiClient";

export const fetchOrderById = async (orderId: string) => {
  const response = await apiClient.get(`/order/${orderId}`);
  return response;
};
