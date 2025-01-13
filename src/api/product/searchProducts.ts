import apiClient from "@/api/dummyApiClient";
import { Product } from "@/types";

export const searchProducts = async (query: string): Promise<Product[]> => {
  try {
    const response = await apiClient.get(`/products/search?q=${query}`);
    // console.log("搜尋結果: ", response.data.products);

    // 篩選僅包含 title 匹配的產品
    const filteredProducts = response.data.products.filter((product: Product) =>
      product.title.toLowerCase().includes(query.toLowerCase())
    );

    return filteredProducts;
  } catch (error) {
    console.error("搜尋時發生錯誤: ", error);
    return []; // 返回空陣列以避免應用崩潰
  }
};
