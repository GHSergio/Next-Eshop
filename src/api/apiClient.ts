// src/api/apiClient.ts
import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://fakestoreapi.com",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

export default apiClient;
