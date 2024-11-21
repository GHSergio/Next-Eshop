// src/supabaseAdminClient.ts
import { createClient } from "@supabase/supabase-js";

// 從環境變數讀取 Supabase URL 和 Service Role Key（後端專用）
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// 初始化後端專用的 Supabase 客戶端
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

// 此 supabaseAdmin 客戶端僅適用於後端代碼。
// 無視 RLS 規則（擁有最高管理權限）。
// 適合進行高權限操作，例如：
// 查詢或更新 auth.users 表。
// 管理或批量更新數據。
// 發送郵件等服務端操作。
