// src/api/dummyApiClient.ts
import axios from "axios";
import axiosRetry from "axios-retry";

const apiClient = axios.create({
  baseURL: "https://dummyjson.com",
  timeout: 10000,
});

axiosRetry(apiClient, {
  retries: 3, // 重試次數
  retryDelay: (retryCount) => Math.min(retryCount * 1000, 3000), // 每次延遲 1 秒，最多 3 秒
  retryCondition: (error) => {
    return (
      error.code === "ECONNABORTED" // 重試條件: 超時錯誤
    );
  },
});

export default apiClient;
