"use client";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

const CartDropdown: React.FC = () => {
  const cart = useSelector((state: RootState) => state.user.cart);

  // 標題樣式
  const headerStyle =
    "font-bold text-center xs:text-[0.6rem] sm:text-sm text-black";

  // 單元格樣式，使用 useMemo 避免不必要的重渲染
  const cellStyle = useMemo(
    () =>
      "overflow-hidden text-ellipsis whitespace-nowrap text-center text-black xs:text-[0.6rem] sm:text-sm",
    []
  );

  const divStyleXs =
    "bottom-[60] top-auto max-w-[320px] w-[80vw] min-w-[250px] max-h-[300px] min-h-[5rem] p-[0.2rem]";

  const divStyleSm =
    "bottom-auto top-full max-w-300 w-[50vw] min-w-[400px] max-h-96 min-h-[7rem] p-2";

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
    <div
      className={`absolute right-0 bg-white shadow-lg z-10 rounded-md overflow-y-auto ${divStyleXs} sm:${divStyleSm}`}
    >
      {/* <div className="absolute right-0 min-w-[300px] min-h-[7rem] bg-white shadow-lg z-10 rounded-md overflow-y-auto xs:bottom-[60px] xs:top-auto xs:max-w-72 xs:max-h-48 xs:p-[0.2rem] sm:bottom-auto sm:top-full sm:max-w-120 sm:max-h-96 sm:p-2"> */}
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
