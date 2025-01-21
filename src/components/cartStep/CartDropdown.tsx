"use client";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

const CartDropdown: React.FC = React.memo(() => {
  const cart = useSelector((state: RootState) => state.user.cart);

  // 標題樣式
  const headerStyle =
    "font-bold text-center xs:text-[0.6rem] sm:text-base text-black";

  // 單元格樣式，使用 useMemo 避免不必要的重渲染
  const cellStyle = useMemo(
    () =>
      "overflow-hidden text-ellipsis whitespace-nowrap text-center text-black xs:text-[0.6rem] sm:text-sm",
    []
  );

  // 根據 cart 資料生成商品項目列表
  const renderedItems = useMemo(() => {
    return cart?.map((item, index) => (
      <div key={index} className="flex gap-1 mb-2">
        <div className={`w-1/2 ${cellStyle}`} title={item.product_name}>
          {item.product_name}
        </div>
        <div className={`w-1/6 ${cellStyle}`}>{item.color || "N/A"}</div>
        <div className={`w-1/6 ${cellStyle}`}>{item.size || "N/A"}</div>
        <div className={`w-1/6 ${cellStyle}`}>{item.quantity}</div>
      </div>
    ));
  }, [cart, cellStyle]);

  return (
    <>
      <div className="xs:hidden sm:block absolute xs:right-[15px] sm:right-[80px] min-w-100 min-h-[7rem] bg-[#C4FAE8] shadow-lg z-10 rounded-md overflow-y-auto xs:bottom-[60px] xs:top-auto xs:max-w-72 xs:max-h-20 xs:p-[0.2rem] sm:bottom-auto sm:top-full sm:max-w-120 sm:max-h-50 sm:p-2">
        {/* 標題區 */}
        <div className="flex justify-between items-center">
          <div className={`w-1/2 ${headerStyle}`}>商品名稱</div>
          <div className={`w-1/6 ${headerStyle}`}>顏色</div>
          <div className={`w-1/6 ${headerStyle}`}>尺寸</div>
          <div className={`w-1/6 ${headerStyle}`}>數量</div>
        </div>
        <hr className="my-2" />
        {/* 商品列表 */}
        {renderedItems}
      </div>
    </>
  );
});

// 設置 displayName，方便在 React DevTools 中調試
CartDropdown.displayName = "CartDropdown";

export default CartDropdown;
