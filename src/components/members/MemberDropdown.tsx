"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import { logoutUserThunk } from "@/store/slice/userSlice";

const MemberDropdown: React.FC = () => {
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();

  // 登出處理
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userInfo");
    dispatch(logoutUserThunk()).unwrap();
    try {
      router.push("/");
    } catch {}
  };

  const ulStyled =
    "absolute flex flex-col justify-center items-center text-center bg-white shadow-lg z-10 rounded-md";

  const sharedStyled =
    "block xs:min-w-full sm:min-w-[3rem] text-left font-bold xs:px-0 sm:px-2 sm:py-1 xs:text-[0.6rem] sm:text-sm text-black-700 hover:bg-blue-100 hover:text-blue-500 transition rounded-md";

  return (
    <>
      {!isLoggedIn ? (
        <ul
          className={`${ulStyled} xs:min-h-[2rem] xs:min-w-[2rem] xs:max-h-24 xs:bottom-[55] xs:right-[0%] xs:p-[0.2rem]
          sm:min-h-[2rem] sm:min-w-[2rem] sm:max-h-35 sm:top-[100%] sm:right-[0%] sm:p-1`}
        >
          <li>
            <Link href="/login" className={sharedStyled}>
              登入
            </Link>
          </li>
        </ul>
      ) : (
        <ul
          className={`${ulStyled} w-32 min-h-[6.5rem] max-h-[7rem] bottom-0 top-10 p-1 overflow-y-auto`}
        >
          <li>
            <Link href="/member" className={sharedStyled}>
              會員中心
            </Link>
          </li>
          <li>
            <button onClick={handleLogout} className={sharedStyled}>
              登出
            </button>
          </li>
        </ul>
      )}
    </>
  );
};

export default MemberDropdown;
