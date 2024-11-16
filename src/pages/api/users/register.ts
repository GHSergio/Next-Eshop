import { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

// 從環境變數加載配置
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

    // 後端檢查 Email 和 Password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email 和密碼為必填項",
        severity: "error",
      });
    }

    try {
      // 1. 檢查是否已有相同的 Email
      const emailCheckQuery = "SELECT id FROM users WHERE email = $1";
      const emailCheckResult = await pool.query(emailCheckQuery, [email]);

      if (emailCheckResult.rows.length > 0) {
        return res.status(409).json({
          success: false,
          message: "該 Email 已被註冊",
          severity: "error",
        });
      }

      // 2. 加密密碼
      const hashedPassword = await bcrypt.hash(password, 10);

      // 3. 將新用戶插入資料庫
      const insertUserQuery = `
        INSERT INTO users (email, password) 
        VALUES ($1, $2) 
        RETURNING id, email
      `;
      const insertUserResult = await pool.query(insertUserQuery, [
        email,
        hashedPassword,
      ]);

      const newUser = insertUserResult.rows[0];

      return res.status(201).json({
        success: true,
        data: newUser,
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
    // 設定 Allow 標頭，表明僅允許 POST 請求
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({
      success: false,
      message: `Method ${req.method} Not Allowed`,
      severity: "error",
    });
  }
}
