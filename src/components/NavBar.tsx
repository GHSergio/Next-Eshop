"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import {
  setShowCart,
  toggleMember,
  setShowMember,
} from "../store/slice/userSlice";
import CartDropdown from "./cartStep/CartDropdown";
import MemberDropdown from "./members/MemberDropdown";
import { fetchTopRatedProducts } from "@/api";
import NavLinks from "./NavLinks";

const NavBar: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [topRatedProducts, setTopRatedProducts] = useState<
    { id: number; title: string; rating: number }[]
  >([]);

  const showCart = useSelector((state: RootState) => state.user.showCart);
  const showMember = useSelector((state: RootState) => state.user.showMember);
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const cart = useSelector((state: RootState) => state.user.cart);

  const totalItems = useMemo(() => {
    return cart && cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const handleCartMouseEnter = useCallback(() => {
    dispatch(setShowCart(true));
  }, [dispatch]);

  const handleCartMouseLeave = useCallback(() => {
    dispatch(setShowCart(false));
  }, [dispatch]);

  const handleMemberClick = useCallback(() => {
    dispatch(toggleMember());
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

  // 獲取 Top 5 商品
  useEffect(() => {
    const getTopRatedProducts = async () => {
      try {
        const products = await fetchTopRatedProducts();
        setTopRatedProducts(products);
      } catch (error) {
        console.error("Failed to fetch top-rated products:", error);
      }
    };
    getTopRatedProducts();
  }, [dispatch]);

  return (
    <nav className="bg-navbarBgc relative">
      <div className="mx-auto px-3 ">
        <div className="xs:flex xs:justify-center sm:grid grid-cols-[1fr_3fr_1fr] items-center h-16">
          {/* Logo */}
          <div
            className="font-extrabold cursor-pointer"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            <Link href="/">
              <span className="text-primary text-2xl">E</span>
              <span className="text-secondary text-lg">Shop</span>
            </Link>
          </div>

          {/* 中間：NavLinks 大螢幕才顯示 */}
          <div className="xs:hidden sm:flex justify-center">
            <NavLinks links={topRatedProducts} />
          </div>

          {/* 右側：Cart and User Icons 大螢幕才顯示 */}
          <div className="xs:hidden sm:flex justify-end items-center space-x-4">
            <div className="relative">
              <button
                onMouseEnter={handleCartMouseEnter}
                className="focus:outline-none p-1"
                onClick={handleCartClick}
              >
                <Image
                  src="/icons/cart-icon.svg"
                  alt="Cart"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
                {/* 購物車有物品時 */}
                {cart && cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
            {/* 使用者 登入 */}
            <div className="">
              <button
                className="focus:outline-none p-1"
                onClick={handleMemberClick}
              >
                <Image
                  src="/icons/user-icon.svg"
                  alt="User"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* dropdown 大螢幕才顯示 */}
      {showMember && (
        <div
          className="xs:hidden sm:block"
          onMouseLeave={handleMemberMouseLeave}
        >
          <MemberDropdown />
        </div>
      )}
      {showCart && (
        <div className="xs:hidden sm:block" onMouseLeave={handleCartMouseLeave}>
          <CartDropdown />
        </div>
      )}
    </nav>
  );
};

export default NavBar;
