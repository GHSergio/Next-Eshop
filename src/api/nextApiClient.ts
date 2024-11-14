// src/api/nextApiClient.ts
import axios from "axios";

const apiClient = axios.create({
  baseURL: "/api", // 針對 Next.js API 路徑
  timeout: 10000,
  // axios 預設會添加 可以省略 Content-Type 的設置
  // headers: { "Content-Type": "application/json" },
});

export default apiClient;
