// src/api/users/fetchUserById.ts
import apiClient from "../nextApiClient";

export const fetchUserById = async (id: string) => {
  const response = await apiClient.get(`/users/${id}`);
  console.log(response);
  return response;
};
