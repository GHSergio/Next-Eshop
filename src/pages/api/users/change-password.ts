import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/supabaseClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    res.setHeader("Allow", ["PUT"]);
    return res.status(405).json({
      success: false,
      message: `Method ${req.method} Not Allowed`,
    });
  }

  const { currentPassword, newPassword } = req.body;
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return res.status(401).json({
      success: false,
      message: "未授權，請登入後再試",
    });
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });

  if (signInError) {
    return res.status(401).json({
      success: false,
      message: "當前密碼不正確",
    });
  }

  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) {
    return res.status(500).json({
      success: false,
      message: "更新密碼失敗",
    });
  }

  return res.status(200).json({
    success: true,
    message: "密碼更新成功",
  });
}
