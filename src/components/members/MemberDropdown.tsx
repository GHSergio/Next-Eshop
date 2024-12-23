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
    "xs:fixed sm:absolute xs:right-[35px] sm:right-[15px] flex flex-col justify-center items-center text-center bg-[#C4FAE8] shadow-lg z-10 rounded-md";

  const liStyled =
    "block text-left font-bold text-black-700 hover:bg-blue-100 hover:text-blue-500 transition rounded-md xs:text-[1rem] sm:text-md";

  return (
    <>
      {!isLoggedIn ? (
        <ul
          className={`${ulStyled} xs:max-w-[70px] xs:min-w-[50px] xs:min-h-[40px] xs:max-h-[45px] xs:bottom-[60px] xs:p-1 sm:bottom-auto`}
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
        <ul
          className={`${ulStyled} xs:max-w-[100px] xs:min-w-[90px] xs:max-h-[80px] xs:bottom-[60px] xs:p-1 sm:max-w-[110px] sm:min-w-[100px] sm:bottom-auto sm:top-[80px] sm:p-2`}
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
          >
            登出
          </li>
        </ul>
      )}
    </>
  );
};

export default MemberDropdown;
