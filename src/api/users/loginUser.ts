// src/api/users/loginUser.ts
import apiClient from "../nextApiClient";
import { LoginUserPayload } from "@/store/slice/types";

export const loginUser = async (userData: LoginUserPayload) => {
  const response = await apiClient.post("/users/login", userData);
  // console.log("登入: ", response);
  return response;
};
