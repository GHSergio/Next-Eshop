// src/api/orders/fetchAllOrders.ts
import apiClient from "../nextApiClient";

export const fetchAllOrders = async () => {
  const response = await apiClient.get("/order");
  return response;
};
