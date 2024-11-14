// src/api/users/registerUser.ts
import apiClient from "../nextApiClient";
import { RegisterUserPayload } from "@/store/slice/types";

export const registerUser = async (userData: RegisterUserPayload) => {
  const response = await apiClient.post("/users/register", userData);
  console.log(response);

  return response; // Axios 自動將 JSON 格式解析為物件
};
