"use client";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setAlert } from "@/store/slice/userSlice";
import { useRouter } from "next/navigation";
import { supabase } from "@/supabaseClient";
import { AlertState } from "@/types";

const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  // 更新 email 狀態
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  // 發送認證信
  const handleSendVerificationEmail = async () => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password: "supabase", // 預設密碼
      });

      if (error) {
        console.error("發送認證信失敗：", error.message);
        dispatch(
          setAlert({
            open: true,
            severity: "error",
            message: `發送失敗: ${error.message}`,
          } as AlertState)
        );
        return;
      }

      dispatch(
        setAlert({
          open: true,
          severity: "success",
          message: `驗證信已發送至 ${email}，請檢查信箱完成驗證。`,
        } as AlertState)
      );
    } catch (error) {
      console.error("意外錯誤：", error);
      dispatch(
        setAlert({
          open: true,
          severity: "error",
          message: "發送認證信時發生錯誤，請稍後再試。",
        } as AlertState)
      );
    }
  };

  const labelClasses = "block xs:text-[0.5rem] md:text-lg font-bold";
  const inputClasses =
    "mt-1 xs:p-0 md:p-2 xs:h-4 md:h-full w-full border xs:rounded-sm md:rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 xs:placeholder-xs md:placeholder-md";

  return (
    <div className="bg-loginBgc xs:z-1 md:z-0 xs:p-4 md:p-8 rounded-md shadow-md xs:w-50 md:w-full max-w-md">
      <h2 className="text-xl font-semibold mb-6">註冊會員</h2>

      {/* 信箱輸入區塊 */}
      <div>
        <label className={labelClasses} htmlFor="emailInput">
          信箱
        </label>
        <input
          type="email"
          id="emailInput"
          value={email}
          onChange={handleEmailChange}
          className={inputClasses}
          placeholder="輸入電子郵件"
          required
        />
      </div>

      {/* 發送認證信按鈕 */}
      <button
        className={`${labelClasses} w-full mt-4 xs:p-1 md:p-1 xs:rounded-sm md:rounded-md text-white py-2 transition`}
        onClick={handleSendVerificationEmail}
      >
        發送認證信
      </button>

      {/* 已有帳號按鈕 */}
      <div className="text-center mt-4">
        <p className="xs:text-[0.4rem] md:text-sm">
          已經有帳號？{" "}
          <button
            className="xs:text-[0.5rem] md:text-lg p-1 xs:rounded-sm md:rounded-md font-bold text-blue-500"
            onClick={() => router.push("/login")}
          >
            前往登入
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
