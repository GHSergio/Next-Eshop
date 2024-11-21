"use client";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/supabaseClient";

const ModifyPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("密碼與確認密碼不一致！");
      return;
    }

    if (newPassword.length < 8) {
      setError("密碼長度必須至少為 8 個字元！");
      return;
    }

    setError(null); // 清除先前錯誤
    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        setError("密碼更新失敗：" + error.message);
        setIsSubmitting(false);
        return;
      }

      setSuccess("密碼更新成功！");
      setTimeout(() => {
        router.push("/login"); // 更新成功後重定向到登入頁面
      }, 2000);
    } catch (error) {
      setError("伺服器發生錯誤，請稍後再試！");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-md shadow-md">
        <h2 className="text-xl font-bold text-center mb-4">修改密碼</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {success && (
            <p className="text-green-500 text-sm text-center">{success}</p>
          )}

          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700"
            >
              新密碼
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="輸入新密碼"
              required
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              確認新密碼
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="再次輸入新密碼"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full p-2 rounded-md text-white ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isSubmitting ? "提交中..." : "更新密碼"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModifyPassword;
