import apiClient from "@/api/dummyApiClient";
import { Product } from "@/types";

export const fetchTopRatedProducts = async (): Promise<
  {
    title: string;
    id: number;
    rating: number;
  }[]
> => {
  const response = await apiClient.get("/products", {
    params: {
      sortBy: "rating",
      order: "desc",
    },
  });
  const result = response.data.products.slice(0, 5).map((product: Product) => ({
    id: product.id,
    title: product.title,
    rating: product.rating,
  }));
  // console.log("rating前五: ", result);
  return result;
};
