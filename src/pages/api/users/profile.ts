import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/supabaseClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res
      .status(405)
      .json({ success: false, message: `Method ${req.method} Not Allowed` });
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return res
      .status(401)
      .json({ success: false, message: "未授權，請登入後再試" });
  }

  return res.status(200).json({
    success: true,
    data: { id: user.id, email: user.email },
  });
}
