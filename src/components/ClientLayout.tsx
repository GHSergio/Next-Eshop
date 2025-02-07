// components/ClientLayout.tsx
"use client";
import React, { useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import {
  setIsLoggedIn,
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

const ClientLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const showMember = useSelector((state: RootState) => state.user.showMember);
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const cart = useSelector((state: RootState) => state.user.cart);
  const shouldReset = useSelector((state: RootState) => state.user.shouldReset);

  const totalItems = useMemo(() => {
    return cart && cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

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
          <button
            onClick={() => router.push("/")}
            className="text-inherit p-0 text-lg mb-[-1px]"
          >
            {/* Home Icon */}
            <Image
              src="/icons/home-icon.svg"
              alt="Cart"
              width={24}
              height={24}
              className="w-6 h-6"
            />
          </button>
          <span className="text-xs">首頁</span>
        </div>

        {/* Cart Icon */}
        <div className="flex flex-col items-center relative">
          <button
            onClick={handleCartClick}
            className="text-inherit p-0 text-lg mb-[-1px] relative"
          >
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
          <span className="text-xs">購物車</span>
        </div>

        {/* User Icon */}
        <div className="flex flex-col items-center">
          <button
            onClick={handleMemberClick}
            className="text-inherit p-0 text-lg mb-[-1px]"
          >
            {/* User Icon */}
            <Image
              src="/icons/user-icon.svg"
              alt="Cart"
              width={24}
              height={24}
              className="w-6 h-6"
            />
          </button>
          <span className="text-xs">個人</span>
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
