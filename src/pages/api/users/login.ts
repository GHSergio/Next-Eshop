import { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT
    ? parseInt(process.env.DATABASE_PORT, 10)
    : undefined,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

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
      // 獲取對應的用戶資料
      const userQuery =
        "SELECT id, email, password FROM users WHERE email = $1";
      const userResult = await pool.query(userQuery, [email]);

      if (userResult.rows.length === 0) {
        return res.status(401).json({
          success: false,
          message: "無效的 Email 或密碼",
          severity: "error",
        });
      }

      const user = userResult.rows[0];

      // 比對密碼
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "無效的 Email 或密碼",
          severity: "error",
        });
      }

      // 返回成功登入的訊息
      return res.status(200).json({
        success: true,
        data: { id: user.id, email: user.email },
        severity: "success",
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Database error: ", error.message);
        return res.status(500).json({
          success: false,
          message: "伺服器發生錯誤，請稍後再試",
          severity: "error",
        });
      } else {
        console.error("Unexpected error:", error);
        return res.status(500).json({
          success: false,
          message: "未知錯誤，請稍後再試",
          severity: "error",
        });
      }
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
