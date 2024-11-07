// // FakeStoreAPI.ts
// import axios from "axios";

// export interface Product {
//   id: number;
//   title: string;
//   price: number;
//   description: string;
//   category: string;
//   image: string;
//   rating: {
//     rate: number;
//     count: number;
//   };
// }

// const apiClient = axios.create({
//   baseURL: "https://fakestoreapi.com",
//   timeout: 10000,
//   headers: { "Content-Type": "application/json" },
// });

// // 獲取所有產品
// export const fetchAllProducts = async (): Promise<Product[]> => {
//   const response = await apiClient.get("/products");
//   // console.log(response.data);
//   return response.data;
// };

// //獲取所有類別
// export const fetchAllCategories = async (): Promise<string[]> => {
//   const response = await apiClient.get("./products/categories");
//   // console.log(response.data);
//   return response.data;
// };

// // 獲取特定類別的產品
// export const fetchProductsByCategory = async (
//   category: string
// ): Promise<Product[]> => {
//   const response = await apiClient.get(`/products/category/${category}`);
//   // console.log(response.data);
//   return response.data;
// };

// // 獲取單個產品
// export const fetchProductById = async (id: number): Promise<Product> => {
//   const response = await apiClient.get(`/products/${id}`);
//   // console.log(response.data);

//   return response.data;
// };

// // 創建新產品（假設有這個功能）
// export const createProduct = async (
//   product: Omit<Product, "id">
// ): Promise<Product> => {
//   const response = await apiClient.post("/products", product);
//   // console.log(response.data);
//   return response.data;
// };

// // 更新產品
// export const updateProduct = async (
//   id: number,
//   product: Partial<Product>
// ): Promise<Product> => {
//   const response = await apiClient.put(`/products/${id}`, product);
//   // console.log(response.data);
//   return response.data;
// };

// // 刪除產品
// export const deleteProduct = async (id: number): Promise<void> => {
//   await apiClient.delete(`/products/${id}`);
// };
