"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { logoutUserThunk } from "@/store/slice/userSlice";

const MemberDropdown: React.FC = () => {
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();

  // 登出處理
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userInfo");
    dispatch(logoutUserThunk());
    router.push("/");
  };

  const ulStyled =
    "absolute xs:bottom-[60] sm:bottom-0 sm:top-9 sm:top-full right-0 flex flex-col justify-center text-center xs:w-30 sm:w-32 bg-white shadow-lg xs:p-[0.2rem] sm:p-1 z-10 xs:max-h-24 sm:max-h-96 xs:overflow-y-auto rounded-md";

  const sharedStyled =
    "block w-full text-left font-bold xs:px-0 sm:px-2 sm:py-1 xs:text-[0.6rem] sm:text-sm text-black-700 hover:bg-blue-100 hover:text-blue-500 transition rounded-md";

  return (
    <>
      {!isLoggedIn ? (
        <ul className={`${ulStyled} xs:min-h-[6rem] sm:min-h-[3rem]`}>
          <li>
            <Link href="/login" className={sharedStyled}>
              登入
            </Link>
          </li>
        </ul>
      ) : (
        <ul className={`${ulStyled} sm:min-h-[6.5rem]`}>
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
