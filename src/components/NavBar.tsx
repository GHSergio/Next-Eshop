"use client";
import React, { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { setShowCart, setShowMember } from "../store/slice/userSlice";
import CartDropdown from "./cartStep/CartDropdown";
import MemberDropdown from "./members/MemberDropdown";
import NavLinks from "./NavLinks";

const NavBar: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const categories = useSelector(
    (state: RootState) => state.products.categories
  );
  const showCart = useSelector((state: RootState) => state.user.showCart);
  const showMember = useSelector((state: RootState) => state.user.showMember);
  // const cartItemCount = useSelector(selectCartItemCount);
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

  return (
    <nav className="bg-navbarBgc">
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

          {/* 中間：NavLinks (只在大螢幕顯示) */}
          <div className="xs:hidden sm:flex justify-center">
            <NavLinks links={categories} />
          </div>

          {/* 右側：Cart and User Icons (只在大螢幕顯示) */}
          <div className="xs:hidden sm:flex justify-end items-center space-x-4">
            <div
              className="relative"
              onMouseEnter={handleCartMouseEnter}
              onMouseLeave={handleCartMouseLeave}
            >
              <button
                className="focus:outline-none p-1"
                onClick={handleCartClick}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-iconColor"
                >
                  <path d="M7 18c-.667 0-1.333.667-1.333 1.333S6.333 21 7 21s1.333-.667 1.333-1.333S7.667 18 7 18zm10 0c-.667 0-1.333.667-1.333 1.333S16.333 21 17 21s1.333-.667 1.333-1.333S17.667 18 17 18zm1.917-4.778L21 5.333c.056-.333-.111-.667-.444-.667H6.111L5.222 2.333C5.167 2.222 5.056 2 4.889 2H1.333c-.333 0-.333.444 0 .444H4.111L5.333 6.5l1.222 9.222c.056.333.389.611.722.611h10.667c.333 0 .611-.167.667-.5l1.611-7.444c.056-.333-.167-.611-.5-.611z" />
                </svg>
                {/* 購物車有物品時 */}
                {cart && cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1">
                    {totalItems}
                  </span>
                )}
              </button>

              {showCart && <CartDropdown />}
            </div>
            {/* 使用者 登入 */}
            <div
              className="relative"
              onMouseEnter={handleMemberMouseEnter}
              onMouseLeave={handleMemberMouseLeave}
            >
              <button className="focus:outline-none p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-iconColor"
                >
                  <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2a7 7 0 00-7 7h2a5 5 0 0110 0h2a7 7 0 00-7-7z" />
                </svg>
              </button>
              {showMember && <MemberDropdown />}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
