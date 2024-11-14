import apiClient from "../fakeApiClient";

// 獲取所有類別
export const fetchAllCategories = async (): Promise<string[]> => {
  const response = await apiClient.get("/products/categories");
  // console.log(response);

  return response.data;
};
