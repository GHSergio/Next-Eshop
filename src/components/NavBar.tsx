"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import {
  setShowCart,
  toggleMember,
  setShowMember,
} from "@/store/slice/userSlice";
// import { setTheme } from "@/store/slice/themeSlice";
import CartDropdown from "./cartStep/CartDropdown";
import MemberDropdown from "./members/MemberDropdown";
import { fetchTopRatedProducts } from "@/api";
import NavLinks from "./NavLinks";

const NavBar: React.FC = () => {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();

  const [topRatedProducts, setTopRatedProducts] = useState<
    { id: number; title: string; rating: number }[]
  >([]);

  const showCart = useSelector((state: RootState) => state.user.showCart);
  const showMember = useSelector((state: RootState) => state.user.showMember);
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const cart = useSelector((state: RootState) => state.user.cart);
  const theme = useSelector((state: RootState) => state.theme.theme);

  const totalItems = useMemo(() => {
    return cart && cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // console.log("當前主題:", theme);

  // 在切換主題時，為 html 標籤設置 class
  useEffect(() => {
    const rootElement = document.documentElement; // 獲取 <html> 標籤
    rootElement.classList.remove("theme-light", "theme-dark");
    rootElement.classList.add(`theme-${theme}`);
  }, [theme]);

  const handleCartMouseEnter = () => {
    dispatch(setShowCart(true));
  };

  const handleCartMouseLeave = () => {
    dispatch(setShowCart(false));
  };

  const handleMemberClick = () => {
    dispatch(toggleMember());
  };

  const handleMemberMouseLeave = () => {
    dispatch(setShowMember(false));
  };

  const handleCartClick = () => {
    if (isLoggedIn) {
      router.push("/cart");
    } else {
      router.push("/login");
    }
  };

  // const handleThemeToggle = () => {
  //   const newTheme = theme === "light" ? "dark" : "light";
  //   dispatch(setTheme(newTheme));
  // };

  const memoizedTopRatedProducts = useMemo(
    () => topRatedProducts,
    [topRatedProducts]
  );

  const buttonStyle = "buttonBgc rounded-lg p-1";

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
      <div className="mx-auto px-3">
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
            {/* <NavLinks links={topRatedProducts} /> */}
            <NavLinks links={memoizedTopRatedProducts} />
          </div>

          {/* 右側：Cart and User Icons 大螢幕才顯示 */}
          <div className="xs:hidden sm:flex justify-end items-center space-x-4">
            {/* Theme Toggle Icon */}
            {/* <div>
              <button
                className={buttonStyle}
                onClick={handleThemeToggle}
                aria-label="切換主題"
              >
                <Image
                  src={
                    theme === "dark"
                      ? "/icons/sun-icon.svg" // （切換到淺色模式）
                      : "/icons/moon-icon.svg" // （切換到深色模式）
                  }
                  alt={theme === "dark" ? "切換到淺色模式" : "切換到深色模式"}
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              </button>
            </div> */}

            {/* Cart */}
            <div className="relative">
              <button
                onMouseEnter={handleCartMouseEnter}
                className={buttonStyle}
                onClick={handleCartClick}
              >
                <Image
                  src="/icons/cart-icon.svg"
                  alt="前往購物車"
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
              <button className={buttonStyle} onClick={handleMemberClick}>
                <Image
                  src="/icons/user-icon.svg"
                  alt="展開更多會員選項"
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
