"use client";
import React, { useState } from "react";

const AuthForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // 處理登入邏輯
    console.log("User is trying to login...");
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // 處理註冊邏輯
    console.log("User is trying to register...");
  };

  const labelClasses = "block xs:text-[0.5rem] md:text-lg font-bold";
  const inputClasses =
    "mt-1 xs:p-0 md:p-2 xs:h-4 md:h-full w-full border xs:rounded-sm md:rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 xs:placeholder-xs md:placeholder-md";

  return (
    <div className="bg-loginBgc xs:p-4 md:p-8 rounded-md shadow-md xs:w-50 md:w-full max-w-md">
      <h2 className="xs:text-sm md:text-2xl font-bold xs:mb-2 md:mb-6 text-center">
        {isLogin ? "登入" : "註冊新帳號"}
      </h2>

      {/* 表單內容 */}
      <form
        onSubmit={isLogin ? handleLogin : handleRegister}
        className="space-y-4"
      >
        {!isLogin && (
          <div>
            <label className={`${labelClasses}`} htmlFor="username">
              使用者名稱
            </label>
            <input
              type="text"
              id="username"
              className={`${inputClasses}`}
              placeholder="輸入使用者名稱"
              required={!isLogin}
            />
          </div>
        )}

        <div>
          <label className={`${labelClasses}`} htmlFor="email">
            帳號
          </label>
          <input
            type="email"
            id="email"
            className={`${inputClasses}`}
            placeholder="輸入電子郵件"
            required
          />
        </div>

        <div>
          <label className={`${labelClasses}`} htmlFor="password">
            密碼
          </label>
          <input
            type="password"
            id="password"
            className={`${inputClasses} `}
            placeholder="輸入密碼"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full xs:text-xs md:text-lg xs:p-0 md:p-1 xs:rounded-sm md:rounded-md"
        >
          {isLogin ? "登入" : "註冊"}
        </button>
      </form>

      <div className="text-center mt-4">
        <p className="xs:text-[0.4rem] md:text-sm">
          {isLogin ? "還沒有帳號？" : "已經有帳號？"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="xs:text-[0.5rem] md:text-lg p-1 xs:rounded-sm md:rounded-md  font-bold"
          >
            {isLogin ? "前往註冊" : "前往登入"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
