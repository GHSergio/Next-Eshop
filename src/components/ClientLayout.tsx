// components/ClientLayout.tsx
"use client";
import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { selectCartItemCount, setShowCart } from "@/store/slice/productSlice";
import NavLinks from "./NavLinks";
import CartDropdown from "./CartDropdown";
import AuthModal from "@/components/AuthModal";
import Alert from "@/components/Alert";

const ClientLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const categories = useSelector(
    (state: RootState) => state.products.categories
  );
  const showCart = useSelector((state: RootState) => state.products.showCart);
  const cartItemCount = useSelector(selectCartItemCount);

  const handleMouseEnter = useCallback(() => {
    dispatch(setShowCart(true));
  }, [dispatch]);

  const handleMouseLeave = useCallback(() => {
    dispatch(setShowCart(false));
  }, [dispatch]);

  // console.log("alert state內容", alert);

  return (
    <div className="min-h-screen flex flex-col relative">
      <Alert />

      {/* 全局的 AuthModal */}
      <AuthModal />
      {/* 小螢幕才出現 NavLinks */}
      <div className="xs:flex justify-center sm:hidden sticky top-16 bg-white w-full z-50 p-1">
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
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button
            onClick={() => router.push("/cart")}
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
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1">
                {cartItemCount}
              </span>
            )}
          </button>
          <span className="text-xs">購物車</span>
          {showCart && <CartDropdown />}
        </div>

        {/* User Icon */}
        <div className="flex flex-col items-center">
          <button
            onClick={() => router.push("/profile")}
            className="text-inherit p-0 text-lg mb-[-1px]"
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
        </div>
      </div>
    </div>
  );
};

export default ClientLayout;
