"use client";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const CartDropdown: React.FC = () => {
  const cart = useSelector((state: RootState) => state.products.cart);

  // 標題樣式
  const headerStyle = "font-bold text-center text-sm text-black";

  // 單元格樣式，使用 useMemo 避免不必要的重渲染
  const cellStyle = useMemo(
    () =>
      "overflow-hidden text-ellipsis whitespace-nowrap text-center text-black",
    []
  );

  // 根據 cart 資料生成商品項目列表
  const renderedItems = useMemo(() => {
    return cart.map((item, index) => (
      <div key={index} className="flex gap-1 mb-2">
        <div className={`w-1/2 ${cellStyle}`} title={item.title}>
          {item.title}
        </div>
        <div className={`w-1/6 ${cellStyle}`}>{item.color || "N/A"}</div>
        <div className={`w-1/6 ${cellStyle}`}>{item.size || "N/A"}</div>
        <div className={`w-1/6 ${cellStyle}`}>{item.quantity}</div>
      </div>
    ));
  }, [cart, cellStyle]);

  return (
    <div className="absolute top-auto sm:top-full right-0 w-72 bg-white shadow-lg p-4 z-30 max-h-96 overflow-y-auto rounded-md">
      {/* 標題區 */}
      <div className="flex justify-between">
        <div className={`w-1/2 ${headerStyle}`}>商品名稱</div>
        <div className={`w-1/6 ${headerStyle}`}>顏色</div>
        <div className={`w-1/6 ${headerStyle}`}>尺寸</div>
        <div className={`w-1/6 ${headerStyle}`}>數量</div>
      </div>
      <hr className="my-2" />

      {/* 商品列表 */}
      {renderedItems}
    </div>
  );
};

export default CartDropdown;
