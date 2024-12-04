// components/ClientLayout.tsx
"use client";
import React, { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import {
  setIsLoggedIn,
  setShowCart,
  setShowMember,
  clearUserInfo,
  fetchUserData,
  fetchCartThunk,
  initializeUserThunk,
} from "../store/slice/userSlice";
import { fetchProductsAndCategories } from "../store/slice/productSlice";
import NavLinks from "./NavLinks";
import CartDropdown from "./CartDropdown";
import MemberDropdown from "./MemberDropdown";
import Alert from "@/components/Alert";
import { supabase } from "@/supabaseClient";

const ClientLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const categories = useSelector(
    (state: RootState) => state.products.categories
  );
  const showCart = useSelector((state: RootState) => state.user.showCart);
  const showMember = useSelector((state: RootState) => state.user.showMember);
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const cartItemCount = useSelector(
    (state: RootState) => state.user.cart?.length
  );

  // 加載分類和產品信息
  useEffect(() => {
    dispatch(fetchProductsAndCategories());
  }, [dispatch]);

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

  // // 檢查使用者登入狀態 & 獲取使用者數據
  // useEffect(() => {
  //   const checkSessionAndInitialize = async () => {
  //     const { data } = await supabase.auth.getSession();
  //     const session = data?.session;

  //     if (session?.user) {
  //       const authId = session.user.id;

  //       // // 檢查 localStorage 是否已有初始化標記
  //       // const cacheKey = `initialized_${authId}`;
  //       // if (!localStorage.getItem(cacheKey)) {
  //       //   // 如果尚未初始化，執行初始化邏輯
  //       //   await dispatch(initializeUserThunk(authId)).unwrap();
  //       // }

  //       // 檢查 localStorage 是否已經初始化過
  //       const cacheKey = `initialized_${authId}`;
  //       const isInitialized = localStorage.getItem(cacheKey);

  //       if (isInitialized) {
  //         console.log("該用戶不需再次初始化");
  //         return;
  //       }

  //       try {
  //         // 如果尚未初始化，執行初始化邏輯
  //         await dispatch(initializeUserThunk(authId)).unwrap();
  //         // 初始化成功則 設置 LocalStorage 標記為已初始化
  //         localStorage.setItem(cacheKey, "true");
  //       } catch (error) {
  //         console.error("初始化用戶數據失敗：", error);
  //       }

  //       // 獲取用戶數據
  //       dispatch(fetchUserData());
  //       dispatch(setIsLoggedIn(true));
  //     } else {
  //       // 若無會話，清理用戶狀態
  //       dispatch(clearUserInfo());
  //       dispatch(setIsLoggedIn(false));
  //     }
  //   };

  //   checkSessionAndInitialize();

  //   // 登入 & 登出 事件發生 才會觸發
  //   const { data: subscription } = supabase.auth.onAuthStateChange(
  //     (event, session) => {
  //       if (event === "SIGNED_IN" && session?.user) {
  //         const authId = session.user.id;

  //         // 檢查 localStorage 並初始化
  //         const cacheKey = `initialized_${authId}`;
  //         if (!localStorage.getItem(cacheKey)) {
  //           dispatch(initializeUserThunk(authId));
  //         }

  //         // 更新 Redux 狀態
  //         dispatch(fetchUserData());
  //         dispatch(setIsLoggedIn(true));
  //       } else if (event === "SIGNED_OUT") {
  //         // 清理登出狀態
  //         dispatch(clearUserInfo());
  //         dispatch(setIsLoggedIn(false));
  //       }
  //     }
  //   );

  //   return () => {
  //     subscription?.subscription.unsubscribe();
  //   };
  // }, [dispatch]);

  // console.log("userInfo state: ", userInfo);

  const handleCartMouseEnter = useCallback(() => {
    dispatch(setShowCart(true));
  }, [dispatch]);

  const handleCartMouseLeave = useCallback(() => {
    dispatch(setShowCart(false));
  }, [dispatch]);

  const handleMemberMouseEnter = useCallback(() => {
    dispatch(setShowMember(true));
  }, [dispatch]);

  const handleMemberMouseLeave = useCallback(() => {
    dispatch(setShowMember(false));
  }, [dispatch]);

  const handleCartClick = () => {
    if (isLoggedIn) {
      router.push("/cart");
    } else {
      router.push("/login");
    }
  };

  // console.log("alert state內容", alert);

  return (
    <div className="min-h-screen flex flex-col relative">
      <Alert />

      {/* 全局的 AuthModal */}
      {/* <AuthModal /> */}
      {/* 小螢幕才出現 NavLinks */}
      <div className="xs:flex justify-center sm:hidden sticky top-16 bg-white w-full z-10 p-1">
        <NavLinks links={categories} />
      </div>

      <main className="flex-1">{children}</main>

      {/* 小螢幕才出現 Bottom Navigation */}
      <div className="sticky bottom-0 left-0 w-full bg-white flex sm:hidden justify-around items-center shadow-md z-20 h-12">
        {/* Home Button */}
        <div className="flex flex-col items-center">
          <button
            onClick={() => router.push("/")}
            className="text-inherit p-0 text-lg mb-[-1px]"
          >
            {/* Home Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="w-6 h-6"
            >
              <path d="M3 9.5L12 3l9 6.5v10a1.5 1.5 0 01-1.5 1.5H4.5A1.5 1.5 0 013 19.5v-10z" />
            </svg>
          </button>
          <span className="text-xs">首頁</span>
        </div>

        {/* Cart Icon */}
        <div
          className="flex flex-col items-center"
          onMouseEnter={handleCartMouseEnter}
          onMouseLeave={handleCartMouseLeave}
        >
          <button
            onClick={handleCartClick}
            className="text-inherit p-0 text-lg mb-[-1px] relative"
          >
            {/* Shopping Cart Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="w-6 h-6"
            >
              <path d="M7 18c-.667 0-1.333.667-1.333 1.333S6.333 21 7 21s1.333-.667 1.333-1.333S7.667 18 7 18zm10 0c-.667 0-1.333.667-1.333 1.333S16.333 21 17 21s1.333-.667 1.333-1.333S17.667 18 17 18zm1.917-4.778L21 5.333c.056-.333-.111-.667-.444-.667H6.111L5.222 2.333C5.167 2.222 5.056 2 4.889 2H1.333c-.333 0-.333.444 0 .444H4.111L5.333 6.5l1.222 9.222c.056.333.389.611.722.611h10.667c.333 0 .611-.167.667-.5l1.611-7.444c.056-.333-.167-.611-.5-.611z" />
            </svg>
            {cartItemCount && cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1">
                {cartItemCount}
              </span>
            )}
          </button>
          <span className="text-xs">購物車</span>
          {showCart && <CartDropdown />}
        </div>

        {/* User Icon */}
        <div className="flex flex-col items-center relative">
          <button
            // onClick={handleUserClick}
            onMouseEnter={handleMemberMouseEnter}
            onMouseLeave={handleMemberMouseLeave}
            className="text-inherit p-0 text-lg mb-[-1px] relative"
          >
            {/* User Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="w-6 h-6"
            >
              <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2a7 7 0 00-7 7h2a5 5 0 0110 0h2a7 7 0 00-7-7z" />
            </svg>
          </button>
          <span className="text-xs">個人</span>
          {showMember && <MemberDropdown />}
        </div>
      </div>
    </div>
  );
};

export default ClientLayout;
