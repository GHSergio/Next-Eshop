// pages/api/users/[id].ts
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  if (req.method === "GET") {
    // 模擬從資料庫取得使用者資料
    return res.status(200).json({
      success: true,
      id,
      name: "Ming Hsu",
      email: "ming@fake.com",
    });
  } else if (req.method === "PUT") {
    // 更新使用者資料
    const updatedUser = { ...req.body, id };
    return res.status(200).json({ success: true, data: updatedUser });
  } else {
    res.setHeader("Allow", ["GET", "PUT"]);
    return res
      .status(405)
      .json({ success: false, error: `Method ${req.method} Not Allowed` });
  }
}
