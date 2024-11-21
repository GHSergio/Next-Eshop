import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/supabaseClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      // 強制刷新會話
      await supabase.auth.refreshSession();
      const { data: session, error } = await supabase.auth.getSession();

      if (error) {
        return res.status(500).json({
          success: false,
          message: error.message || "無法獲取用戶會話",
        });
      }

      if (!session?.session?.user) {
        return res.status(200).json({
          success: true,
          emailVerified: false,
        });
      }

      const user = session.session.user;

      return res.status(200).json({
        success: true,
        emailVerified: !!user.email_confirmed_at, // 確認是否已驗證
        id: user.id,
        email: user.email,
      });
    } catch (error: any) {
      console.error("SyncUserStatus Error:", error.message);
      return res.status(500).json({
        success: false,
        message: "伺服器錯誤，請稍後再試。",
      });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({
      success: false,
      message: `Method ${req.method} 不被允許`,
    });
  }
}
