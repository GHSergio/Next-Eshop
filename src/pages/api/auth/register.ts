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
      // 使用 Supabase Auth 註冊用戶
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        console.error("Supabase Auth Error: ", authError.message);

        // 捕獲未認證的情況
        if (authError.message.includes("already registered")) {
          return res.status(403).json({
            success: false,
            message: "該 Email 尚未認證，請檢查信箱進行認證。",
            severity: "warning",
          });
        }

        // 處理其他未知錯誤
        throw new Error(authError.message);
      }

      // 檢查自定義 `users` 表中是否已存在該用戶
      const { data: existingUser, error: selectError } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

      if (selectError && selectError.code !== "PGRST116") {
        console.error("Supabase Select Error: ", selectError.message);
        throw new Error(selectError.message);
      }

      if (existingUser) {
        console.log("User already exists in `users` table");
        return res.status(409).json({
          success: false,
          message: "該 Email 已被註冊到自定義表中",
          severity: "error",
        });
      }

      // 將用戶信息存入自定義的 `users` 表
      const { error: userInsertError } = await supabase.from("users").insert([
        {
          id: authData.user?.id,
          email: authData.user?.email,
          created_at: new Date().toISOString(),
        },
      ]);

      if (userInsertError) {
        console.error("User Insert Error: ", userInsertError.message);
        throw new Error(userInsertError.message);
      }

      // 返回成功響應
      return res.status(201).json({
        success: true,
        data: {
          id: authData.user?.id,
          email: authData.user?.email,
        },
        severity: "success",
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Supabase Error: ", error.message);
      }
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
      message: `Method ${req.method} 不被允許`,
      severity: "error",
    });
  }
}
