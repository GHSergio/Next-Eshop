import apiClient from "../fakeApiClient";

// 刪除產品
export const deleteProduct = async (id: number): Promise<void> => {
  await apiClient.delete(`/products/${id}`);
};
