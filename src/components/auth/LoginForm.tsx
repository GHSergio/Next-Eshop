"use client";
import React from "react";
// import React, { useState } from "react";
// import { supabase } from "@/supabaseClient";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
// import { useDispatch, useSelector } from "react-redux";
// import { setAlert } from "@/store/slice/userSlice";
import { AppDispatch } from "@/store/store";
// import { RootState, AppDispatch } from "@/store/store";
import { loginUserThunk, loginWithGoogleThunk } from "@/store/slice/userSlice";
const LoginForm: React.FC = () => {
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  // // 信箱輸入處理
  // const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setEmail(e.target.value);
  // };

  // console.log(isLoggedIn);

  // // 密碼輸入處理
  // const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setPassword(e.target.value);
  // };

  // // 一般登入
  // const handleLogin = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   try {
  //     await dispatch(loginUserThunk({ email, password })).unwrap();
  //     router.push("/");
  //   } catch (error: unknown) {
  //     // 檢查 error 是否為標準的 Error 實例。
  //     if (error instanceof Error) {
  //       console.error("登入失敗：", error.message);
  //     } else {
  //       // 如果不是 Error，可以將其當作普通物件記錄。
  //       console.error("未知錯誤：", error);
  //     }
  //   }
  // };

  // Google 登入
  const handleGoogleLogin = async () => {
    try {
      await dispatch(loginWithGoogleThunk()).unwrap();
      router.push("/");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Google 登入失敗：", error.message);
      } else {
        console.error("未知錯誤：", error);
      }
    }
  };

  // 遊客(固定)登入
  const handleGuestLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await dispatch(
        loginUserThunk({
          email: "guest@example.com",
          password: "guestpassword123",
        })
      ).unwrap();
      router.push("/");
    } catch (error) {
      if (error instanceof Error) {
        console.error("訪客登入失敗：", error.message);
      } else {
        console.error("未知錯誤：", error);
      }
    }
  };

  // const handleLogin = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   try {
  //     const { error } = await supabase.auth.signInWithPassword({
  //       email,
  //       password,
  //     });
  //     console.log(error);
  //     if (error) {
  //       if (error.status === 400) {
  //         console.error("無效憑證：", error.message);
  //         dispatch(
  //           setAlert({
  //             open: true,
  //             severity: "error",
  //             message: "無效憑證：" + error.message,
  //           })
  //         );
  //       } else if (error.status === 404) {
  //         console.error("登入失敗：", error.message);
  //         dispatch(
  //           setAlert({
  //             open: true,
  //             severity: "error",
  //             message: "帳號不存在：" + error.message,
  //           })
  //         );
  //       }
  //     } else {
  //       //成功
  //       dispatch(
  //         setAlert({ open: true, severity: "success", message: "登入成功！" })
  //       );
  //       dispatch(setIsLoggedIn(true));
  //       router.push("/"); // 導向首頁
  //     }
  //   } catch (error) {
  //     console.error("意外錯誤：", error);
  //     dispatch(
  //       setAlert({
  //         open: true,
  //         severity: "error",
  //         message: "發生意外錯誤，請稍後再試。",
  //       })
  //     );
  //   }
  // };

  // Google 登入
  // const handleGoogleLogin = async () => {
  //   try {
  //     const { error } = await supabase.auth.signInWithOAuth({
  //       provider: "google",
  //     });
  //     if (error) {
  //       console.error("Google 登入失敗：", error.message);
  //       dispatch(
  //         setAlert({
  //           open: true,
  //           severity: "error",
  //           message: "Google 登入失敗：" + error.message,
  //         })
  //       );
  //     } else {
  //       dispatch(
  //         setAlert({
  //           open: true,
  //           severity: "success",
  //           message: "Google 登入成功！",
  //         })
  //       );
  //       dispatch(setIsLoggedIn(true));
  //       router.push("/"); // 導向首頁
  //     }
  //   } catch (error) {
  //     console.error("意外錯誤：", error);
  //     dispatch(
  //       setAlert({
  //         open: true,
  //         severity: "error",
  //         message: "發生意外錯誤，請稍後再試。",
  //       })
  //     );
  //   }
  // };

  // // 訪客登入
  // const handleGuestLogin = async () => {
  //   try {
  //     const { error } = await supabase.auth.signInWithPassword({
  //       email: "guest@example.com",
  //       password: "guestpassword123",
  //     });
  //     if (error) {
  //       console.error("訪客登入失敗：", error.message);
  //       dispatch(
  //         setAlert({
  //           open: true,
  //           severity: "error",
  //           message: "訪客登入失敗：" + error.message,
  //         })
  //       );
  //     } else {
  //       dispatch(
  //         setAlert({
  //           open: true,
  //           severity: "success",
  //           message: "訪客登入成功！",
  //         })
  //       );
  //       dispatch(setIsLoggedIn(true));
  //       router.push("/"); // 導向首頁
  //     }
  //   } catch (error) {
  //     console.error("意外錯誤：", error);
  //     dispatch(
  //       setAlert({
  //         open: true,
  //         severity: "error",
  //         message: "發生意外錯誤，請稍後再試。",
  //       })
  //     );
  //   }
  // };

  const labelStyle = "block xs:text-sm md:text-lg font-bold";
  // const inputClasses =
  //   "mt-1 xs:p-0 md:p-2 xs:h-4 md:h-full w-full border xs:rounded-sm md:rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 xs:placeholder-xs md:placeholder-md";

  return (
    <div className="bg-loginBgc xs:z-1 md:z-0 xs:p-4 md:p-8 rounded-md shadow-md xs:w-50 md:w-full max-w-md">
      <h2 className="xs:text-sm md:text-2xl font-bold xs:mb-2 md:mb-6 text-center">
        登入
      </h2>

      {/* 表單內容 */}
      {/* <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className={`${labelClasses} `} htmlFor="emailInput">
            信箱
          </label>
          <input
            type="email"
            id="emailInput"
            value={email}
            onChange={handleEmailChange}
            className={`${inputClasses}`}
            placeholder="輸入電子郵件"
            required
          />
        </div>

        <div>
          <label className={`${labelClasses}`} htmlFor="passwordInput">
            密碼
          </label>
          <input
            type="password"
            id="passwordInput"
            value={password}
            onChange={handlePasswordChange}
            className={`${inputClasses}`}
            placeholder="輸入密碼"
            required
          />
        </div>

        <button
          type="submit"
          className={`${labelClasses} w-full xs:p-1 md:p-1 xs:rounded-sm md:rounded-md text-white transition`}
        >
          登入
        </button>
      </form> */}

      <div>
        <p>Google登入初始化異常，正在修改</p>
        <p>請先使用訪客身份登入</p>
      </div>

      {/* 訪客登入按鈕 */}
      <div>
        <button
          onClick={handleGuestLogin}
          className={`${labelStyle} w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-400 transition-all duration-300`}
        >
          以訪客身份登入
        </button>
      </div>

      {/* Google 登入按鈕 */}
      <div className="mt-4">
        <button
          onClick={handleGoogleLogin}
          className={`${labelStyle} w-full bg-blue-500 text-white py-2 rounded-lg mb-4 hover:bg-blue-600 transition-all duration-300`}
        >
          使用 Google 登入
        </button>
      </div>

      {/* 註冊切換按鈕 */}
      {/* <div className="text-center mt-4">
        <p className="xs:text-[0.4rem] md:text-sm">
          還沒有帳號？{" "}
          <button
            className="xs:text-[0.5rem] md:text-lg p-1 xs:rounded-sm md:rounded-md font-bold text-blue-500"
            onClick={() => router.push("/register")}
          >
            前往註冊
          </button>
        </p>
      </div> */}
    </div>
  );
};

export default LoginForm;
