import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/supabaseClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // if (req.method !== "POST") {
  //   res.setHeader("Allow", ["POST"]);
  //   return res.status(405).json({
  //     success: false,
  //     message: `Method ${req.method} 不被允許`,
  //   });
  // }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "請提供 Email。",
    });
  }

  try {
    // 嘗試註冊用戶
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password: "supabase",
    });

    if (signUpError) {
      if (signUpError.message.includes("already registered")) {
        // 如果用戶已註冊，返回 409 錯誤
        return res.status(409).json({
          success: false,
          message: "該信箱已被註冊，請檢查您的信箱完成認證。",
        });
      }
      // 返回其他註冊錯誤
      throw new Error(signUpError.message);
    }

    // 註冊成功，返回成功訊息
    return res.status(200).json({
      success: true,
      message: "認證信已發送，請檢查信箱。",
    });
  } catch (error: any) {
    console.error("Supabase Error: ", error.message);
    return res.status(500).json({
      success: false,
      message: "伺服器發生錯誤，請稍後再試。",
    });
  }
}
