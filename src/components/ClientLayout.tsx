// components/ClientLayout.tsx
"use client";
import React, { useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import {
  setIsLoggedIn,
  setUserInfo,
  setAlert,
  // setShowCart,
  toggleMember,
  clearUserInfo,
  fetchUserData,
  fetchCartThunk,
  initializeUserThunk,
  fetchAddressesThunk,
  fetchStoresThunk,
  toggleCart,
  resetOrder,
  setShouldReset,
} from "../store/slice/userSlice";
import { fetchProductsAndCategories } from "../store/slice/productSlice";
// import NavLinks from "./NavLinks";
// import CartDropdown from "./cartStep/CartDropdown";
import MemberDropdown from "./members/MemberDropdown";
import Alert from "@/components/Alert";
import { supabase } from "@/supabaseClient";
import Image from "next/image";
import { AlertState } from "@/types";

const ClientLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const showMember = useSelector((state: RootState) => state.user.showMember);
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const cart = useSelector((state: RootState) => state.user.cart);
  const shouldReset = useSelector((state: RootState) => state.user.shouldReset);

  const totalItems = useMemo(() => {
    return cart && cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // 檢查是否需要初始化 & 調用初始化
  const handleInitialization = useCallback(
    async (authId: string) => {
      const cacheKey = `initialized_${authId}`;
      const isInitialized = localStorage.getItem(cacheKey);

      if (isInitialized) {
        console.log("該用戶不需再次初始化");
        return;
      }

      try {
        await dispatch(initializeUserThunk(authId)).unwrap();
        localStorage.setItem(cacheKey, "true");
      } catch (error) {
        console.error("初始化用戶數據失敗：", error);
      }
    },
    [dispatch]
  );

  // 檢查使用者 登入狀態
  const checkSessionAndInitialize = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    const session = data?.session;

    if (session?.user) {
      const authId = session.user.id;
      // 檢查初始化
      await handleInitialization(authId);
      dispatch(fetchUserData());
      dispatch(fetchCartThunk(authId));
      dispatch(fetchAddressesThunk(authId));
      dispatch(fetchStoresThunk(authId));
      dispatch(setIsLoggedIn(true));
    } else {
      dispatch(clearUserInfo());
      dispatch(setIsLoggedIn(false));
    }
  }, [dispatch, handleInitialization]);

  // 監聽 Supabase 的 Auth 狀態：
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          dispatch(setUserInfo(session.user)); // 更新 Redux 狀態
          dispatch(
            setAlert({ severity: "success", message: "用戶登入成功！" })
          );
        }

        if (event === "SIGNED_OUT") {
          dispatch(
            setAlert({
              open: true,
              severity: "info",
              message: "用戶登出成功",
            } as AlertState)
          );
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [dispatch]);

  useEffect(() => {
    checkSessionAndInitialize();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          const authId = session.user.id;
          await handleInitialization(authId);
          dispatch(fetchUserData());
          dispatch(fetchCartThunk(authId));
          dispatch(fetchAddressesThunk(authId));
          dispatch(fetchStoresThunk(authId));
          dispatch(setIsLoggedIn(true));
        } else if (event === "SIGNED_OUT") {
          dispatch(clearUserInfo());
          dispatch(setIsLoggedIn(false));
        }
      }
    );

    return () => {
      subscription?.subscription.unsubscribe();
    };
  }, [dispatch, checkSessionAndInitialize, handleInitialization]);

  // 加載分類和產品信息
  useEffect(() => {
    dispatch(fetchProductsAndCategories());
  }, [dispatch]);

  // 根據 shouldReset 執行 resetOrder
  useEffect(() => {
    if (shouldReset) {
      dispatch(resetOrder()); // 重置訂單狀態
      // console.log("reset訂單");
      dispatch(setShouldReset(false)); // 清除 shouldReset 狀態
    }
  }, [shouldReset, dispatch]);

  // console.log("userInfo state: ", userInfo);

  const handleCartClick = () => {
    dispatch(toggleCart());
    if (isLoggedIn) {
      router.push("/cart");
    } else {
      router.push("/login");
    }
  };

  const handleMemberClick = useCallback(() => {
    dispatch(toggleMember());
  }, [dispatch]);

  // console.log("alert state內容", alert);

  const defaultAvatarText = userInfo?.email
    ? userInfo.email.charAt(0).toUpperCase()
    : "U";

  const buttonStyle = "buttonBgc rounded-lg p-1";

  return (
    <div className="min-h-screen flex flex-col relative">
      <Alert />

      {/* 全局的 AuthModal */}
      {/* <AuthModal /> */}
      {/* 小螢幕才出現 NavLinks */}
      {/* <div className="xs:flex justify-center sm:hidden sticky top-16 bg-[#9EF7D9] w-full z-10 p-1">
        <NavLinks links={categories} />
      </div> */}

      <main className="flex-1">{children}</main>

      {/* 小螢幕才出現 Bottom Navigation */}
      <div className="sticky bottom-0 left-0 w-full bg-[#9EF7D9] flex sm:hidden justify-around items-center shadow-md z-20 h-12">
        {/* Home Button */}
        <div className="flex flex-col items-center">
          <button onClick={() => router.push("/")} className={buttonStyle}>
            {/* Home Icon */}
            <Image
              src="/icons/home-icon.svg"
              alt="Cart"
              width={24}
              height={24}
              className="w-6 h-6"
            />
          </button>
        </div>

        {/* Cart Icon */}
        <div className="flex flex-col items-center relative">
          <button onClick={handleCartClick} className={buttonStyle}>
            {/* Shopping Cart Icon */}
            <Image
              src="/icons/cart-icon.svg"
              alt="Cart"
              width={24}
              height={24}
              className="w-6 h-6"
            />
            {cart && cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1">
                {totalItems}
              </span>
            )}
          </button>
        </div>

        {/* User Icon */}

        <div className="relative">
          {/* 未登入：顯示預設使用者圖示 */}
          {!isLoggedIn ? (
            <button className={buttonStyle} onClick={handleMemberClick}>
              <Image
                src="/icons/user-icon.svg"
                alt="展開更多會員選項"
                width={24}
                height={24}
                className="w-6 h-6"
              />
            </button>
          ) : (
            // 已登入：顯示 Email 第一個字母（大寫）+ 灰色圓形背景
            <button
              className="w-8 h-8 flex items-center justify-center bg-gray-300 rounded-full space-x-2"
              onClick={handleMemberClick}
            >
              {userInfo?.avatar_url ? (
                <Image
                  src={userInfo.avatar_url}
                  alt="會員頭像"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              ) : (
                <div className="text-black font-bold">{defaultAvatarText}</div>
              )}
            </button>
          )}
        </div>
      </div>
      {/* Member dropdown 小螢幕才顯示 */}
      {showMember && (
        <div className="xs:block md:hidden">
          <MemberDropdown />
        </div>
      )}
    </div>
  );
};

export default ClientLayout;
