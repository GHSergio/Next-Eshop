import { Pool } from "pg";

// 從環境變數加載配置
const pool = new Pool({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT
    ? parseInt(process.env.DATABASE_PORT, 10)
    : undefined, // 確保轉換為數字  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

export default async function handler(req, res) {
  try {
    // 測試資料庫連接
    const result = await pool.query("SELECT NOW()");
    res.status(200).json({ success: true, serverTime: result.rows[0].now });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
