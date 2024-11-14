// pages/api/user/register.ts
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { email, password } = req.body;
    console.log("後端接收到的: ", email, password);
    // 模擬一個檢查：假設此 email 已被註冊
    if (email === "admin9527@fakemail.com") {
      return res.status(409).json({
        success: false,
        message: "該 Email 已被註冊",
        severity: "error",
      });
    }

    // 如果註冊成功
    const newUser = {
      id: Date.now().toString(),
      email,
      password,
    };

    return res
      .status(201)
      .json({ success: true, data: newUser, severity: "success" });
  } else {
    // 設定 Allow 標頭，表明僅允許 POST 請求
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({
      success: false,
      message: `Method ${req.method} Not Allowed`,
      severity: "error",
    });
  }
}
