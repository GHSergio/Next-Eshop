// pages/api/auth/login.ts
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { email, password } = req.body;
    // console.log(email, password);
    // 假設我們檢查帳號密碼，並生成一個登入 token
    if (email === "admin9527@fakemail.com" && password === "123456") {
      return res.status(200).json({
        success: true,
        message: "Login successful",
        token: "fake-jwt-token",
        severity: "success",
      });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "帳號或密碼錯誤", severity: "error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({
      success: false,
      message: `Method ${req.method} Not Allowed`,
      severity: "error",
    });
  }
}
