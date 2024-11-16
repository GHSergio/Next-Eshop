import { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";

// 設定資料庫連接池
const pool = new Pool({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: parseInt(process.env.DATABASE_PORT || "5432", 10),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      // 從資料庫查詢使用者資料
      const result = await pool.query("SELECT * FROM users WHERE id = $1", [
        id,
      ]);

      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      return res.status(200).json({ success: true, data: result.rows[0] });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Database error:", error.message);
        return res
          .status(500)
          .json({ success: false, message: "Server error: " + error.message });
      } else {
        console.error("Unexpected error:", error);
        return res
          .status(500)
          .json({ success: false, message: "Unexpected server error" });
      }
    }
  } else if (req.method === "PUT") {
    const { name, email } = req.body;

    try {
      // 更新資料庫中的使用者資料
      const result = await pool.query(
        "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *",
        [name, email, id]
      );

      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      return res.status(200).json({ success: true, data: result.rows[0] });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Database error:", error.message);
        return res
          .status(500)
          .json({ success: false, message: "Server error: " + error.message });
      } else {
        console.error("Unexpected error:", error);
        return res
          .status(500)
          .json({ success: false, message: "Unexpected server error" });
      }
    }
  } else {
    // 其他請求方法不允許
    res.setHeader("Allow", ["GET", "PUT"]);
    return res
      .status(405)
      .json({ success: false, message: `Method ${req.method} Not Allowed` });
  }
}
