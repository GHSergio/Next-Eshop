"use client";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { registerUserThunk, loginUserThunk } from "@/store/slice/userSlice";

const AuthForm: React.FC = () => {
  // 顯示 register / login form
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch: AppDispatch = useDispatch();
  const { message } = useSelector((state: RootState) => state.user.alert);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const userData = { email, password };
    await dispatch(loginUserThunk(userData));
    // 處理登入邏輯
    console.log("login的userData:", userData);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const userData = { email, password };
    await dispatch(registerUserThunk(userData));
    // 處理註冊邏輯
    // console.log("register的userData:", userData);
  };

  const handleToggleForm = () => {
    setIsLogin(!isLogin);
    setEmail("");
    setPassword("");
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
        {/* 錯誤訊息顯示 */}
        {message && (
          <p className="text-red-500 text-sm text-center">{message}</p>
        )}
        {/* <div>
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
        </div> */}

        <div>
          <label className={`${labelClasses}`} htmlFor="email">
            信箱
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            // onClick={() => setIsLogin(!isLogin)}
            onClick={handleToggleForm}
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
