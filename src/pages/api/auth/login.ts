import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/supabaseClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email 和密碼為必填項",
        severity: "error",
      });
    }

    try {
      // 使用 Supabase Auth 驗證 Email 和密碼
      const { data: session, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Supabase SignIn Error: ", error); // 打印詳細錯誤

        // 判斷是否是用戶未激活的情況
        if (error.message.includes("Email not confirmed")) {
          return res.status(403).json({
            success: false,
            message: "該 Email 尚未註冊",
            severity: "warning",
          });
        }

        // 判斷是否是密碼錯誤
        if (error.message.includes("Invalid login credentials")) {
          return res.status(401).json({
            success: false,
            message: "Email 或密碼錯誤",
            severity: "error",
          });
        }

        throw new Error(error.message); // 處理其他未知錯誤
      }

      // 檢查是否為臨時密碼
      if (password === "supabase") {
        return res.status(200).json({
          success: true,
          message: "登入成功，建議立即更換新密碼。",
          redirectTo: "/reset-password", // 提示重定向到修改密碼頁面
        });
      }

      // 返回成功登入的訊息
      return res.status(200).json({
        success: true,
        data: {
          id: session.user?.id,
          email: session.user?.email,
        },
        severity: "success",
      });
    } catch (error: any) {
      console.error("Supabase error: ", error.message);
      return res.status(500).json({
        success: false,
        message: "伺服器發生錯誤，請稍後再試",
        severity: "error",
      });
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
