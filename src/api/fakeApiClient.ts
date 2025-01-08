// src/api/fakeApiClient.ts
import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://fakestoreapi.com",
  timeout: 30000,
  // headers: { "Content-Type": "application/json" },
});

export default apiClient;
