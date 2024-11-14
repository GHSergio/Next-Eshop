// src/api/users/updateUser.ts
import apiClient from "../nextApiClient";

// Partial是?
export const updateUser = async (
  id: string,
  updatedData: Partial<{ name: string; email: string }>
) => {
  const response = await apiClient.put(`/users/${id}`, updatedData);
  console.log(response);
  return response.data;
};
