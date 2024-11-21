import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/supabaseClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email 為必填項",
      });
    }

    try {
      // 再次調用 auth.signUp()，Supabase 會自動重新發送認證郵件
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password: "temporary", // 必須提供密碼，即使是暫時的
      });

      if (signUpError) {
        console.error("Supabase SignUp Error: ", signUpError.message);
        throw new Error(signUpError.message);
      }

      return res.status(200).json({
        success: true,
        message: "認證郵件已發送，請檢查郵箱。",
      });
    } catch (error: any) {
      console.error("Supabase Error: ", error.message);
      return res.status(500).json({
        success: false,
        message: "伺服器發生錯誤，請稍後再試",
      });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({
      success: false,
      message: `Method ${req.method} 不被允許`,
    });
  }
}
