// src/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

// 從環境變數讀取 Supabase URL 和 Anon Key（客戶端專用）
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// 初始化客戶端專用的 Supabase 客戶端
// 創建 Supabase 客戶端，並啟用 `persistSession`
// 初始化客戶端專用的 Supabase 客戶端
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // 確保 Token 會存儲並自動刷新
    autoRefreshToken: true, // 允許自動刷新 Token
    detectSessionInUrl: true,
  },
});

// 此 supabase 客戶端僅適用於客戶端代碼。
// 遵循 RLS（Row Level Security）規則。
// 適合用於客戶端與 Supabase 通信。
