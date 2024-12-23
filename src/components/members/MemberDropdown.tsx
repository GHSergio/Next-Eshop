"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import { logoutUserThunk, setShowMember } from "@/store/slice/userSlice";

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
      dispatch(setShowMember(false));
      router.push("/");
    } catch {}
  };

  const ulStyled =
    "absolute right-0 flex flex-col justify-center items-center text-center bg-white shadow-lg z-10 rounded-md";

  const liStyled =
    "block text-left font-bold text-black-700 hover:bg-blue-100 hover:text-blue-500 transition rounded-md xs:text-[0.6rem] sm:text-[1rem]";

  return (
    <>
      {!isLoggedIn ? (
        // 大螢幕
        <ul
          className={`${ulStyled} xs:max-w-[60] xs:min-w-[50] xs:max-h-[40] xs:bottom-[55] xs:p-1 sm:bottom-auto sm:top-[60]`}
        >
          <li>
            <Link
              href="/login"
              className={liStyled}
              onClick={() => dispatch(setShowMember(false))}
            >
              登入
            </Link>
          </li>
        </ul>
      ) : (
        // 小螢幕
        <ul
          className={`${ulStyled} xs:max-w-[70] xs:min-w-[65] xs:max-h-[80] xs:bottom-[55] xs:top-auto xs:p-1 sm:max-w-[110] sm:min-w-[100] sm:bottom-auto sm:top-[50] sm:p-2`}
        >
          <li>
            <Link
              href="/member"
              className={liStyled}
              onClick={() => dispatch(setShowMember(false))}
            >
              會員中心
            </Link>
          </li>
          <li
            onClick={handleLogout}
            className={`${liStyled} cursor-pointer`}
            role="button"
            tabIndex={0}
            // onKeyDown={(e) => e.key === "Enter" && handleLogout()}
          >
            登出
          </li>
        </ul>
      )}
    </>
  );
};

export default MemberDropdown;
