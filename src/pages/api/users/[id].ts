import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/supabaseClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query; // 從查詢參數中獲取用戶 ID

  if (!id || typeof id !== "string") {
    return res.status(400).json({
      success: false,
      message: "用戶 ID 是必填的",
    });
  }

  if (req.method === "GET") {
    // **查詢使用者資料**
    try {
      const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !user) {
        return res.status(404).json({
          success: false,
          message: "找不到該用戶",
        });
      }

      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error: any) {
      console.error("Supabase error:", error.message);
      return res.status(500).json({
        success: false,
        message: "伺服器發生錯誤，請稍後再試",
      });
    }
  } else if (req.method === "PUT") {
    // **更新使用者資料**
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "名稱和 Email 為必填項",
      });
    }

    try {
      const { data: updatedUser, error } = await supabase
        .from("users")
        .update({ name, email })
        .eq("id", id)
        .select()
        .single();

      if (error || !updatedUser) {
        return res.status(404).json({
          success: false,
          message: "用戶更新失敗或不存在",
        });
      }

      return res.status(200).json({
        success: true,
        data: updatedUser,
      });
    } catch (error: any) {
      console.error("Supabase error:", error.message);
      return res.status(500).json({
        success: false,
        message: "伺服器發生錯誤，請稍後再試",
      });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT"]);
    return res.status(405).json({
      success: false,
      message: `Method ${req.method} 不被允許`,
    });
  }
}
