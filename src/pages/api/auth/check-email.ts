import { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "@/supabaseAdminClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({
      success: false,
      message: `Method ${req.method} 不被允許。`,
    });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "請提供 Email。",
    });
  }

  try {
    // 使用 RPC 查詢用戶
    const { data, error } = await supabaseAdmin.rpc(
      "auth.fetch_user_by_email",
      {
        email_input: email,
      }
    );

    if (error) {
      console.error("Supabase RPC Error:", error.message);
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      return res.status(200).json({
        success: true,
        exists: false,
        emailVerified: false,
        message: "該 Email 可用，可進行註冊。",
      });
    }

    const { email_confirmed_at } = data[0];

    return res.status(200).json({
      success: true,
      exists: true,
      emailVerified: !!email_confirmed_at,
      message: email_confirmed_at ? "該 Email 已認證。" : "該 Email 尚未認證。",
    });
  } catch (error: any) {
    console.error("API Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "伺服器錯誤，請稍後再試。",
    });
  }
}
