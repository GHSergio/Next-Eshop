"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import {
  logoutUserThunk,
  setShowMember,
  resetOrder,
  setAlert,
} from "@/store/slice/userSlice";
import { AlertState } from "@/types";

const MemberDropdown: React.FC = React.memo(() => {
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();

  // 登出
  const handleLogout = async () => {
    try {
      // 調用登出 Thunk，並使用 `unwrap()` 來檢查結果
      await dispatch(logoutUserThunk()).unwrap();

      // 只有成功登出時，才清除 localStorage & Redux 狀態
      localStorage.removeItem("authToken");
      localStorage.removeItem("userInfo");
      dispatch(resetOrder());

      // 關閉會員下拉選單
      dispatch(setShowMember(false));

      // 讓 `ClientLayout` 自己偵測到 `SIGNED_OUT` 事件並顯示 Alert
      router.push("/");
    } catch (error) {
      // 如果登出失敗，立即顯示錯誤 `alert`
      dispatch(
        setAlert({
          open: true,
          severity: "error",
          message: `登出失敗，${error}！`,
        } as AlertState)
      );
    }
  };

  // // 登出處理
  // const handleLogout = () => {
  //   localStorage.removeItem("authToken");
  //   localStorage.removeItem("userInfo");
  //   dispatch(resetOrder());
  //   dispatch(logoutUserThunk()).unwrap();
  //   try {
  //     dispatch(setShowMember(false));
  //     router.push("/");
  //   } catch (error) {
  //     dispatch(
  //       setAlert({
  //         open: true,
  //         severity: "error",
  //         message: `登出失敗，${error}！`,
  //       } as AlertState)
  //     );
  //   }
  // };

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
});

// 設置 displayName，方便在 React DevTools 中調試
MemberDropdown.displayName = "MemberDropdown";

export default MemberDropdown;
