"use client";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const CartFooter = () => {
  const selectedItems = useSelector(
    (state: RootState) => state.user.selectedItems
  );
  const shippingCost = useSelector(
    (state: RootState) => state.user.shippingCost
  );

  // 計算總數量
  const calculateItemsCount = useMemo(
    () => selectedItems.reduce((count, item) => count + item.quantity, 0),
    [selectedItems]
  );

  // 計算總金額
  const totalAmount = useMemo(
    () =>
      selectedItems.reduce(
        (sum, item) => sum + item.product_price * item.quantity,
        0
      ),
    [selectedItems]
  );
  // 計算折扣
  const discount = useMemo(
    () => (totalAmount > 1000 ? shippingCost : 0),
    [totalAmount, shippingCost]
  );

  // 計算最終金額
  const finalTotal = useMemo(
    () => totalAmount + shippingCost - discount,
    [totalAmount, shippingCost, discount]
  );

  return (
    <div className="mt-4 space-y-3 text-right text-sm">
      <p>共 {calculateItemsCount} 件商品</p>
      <p>商品金額：${totalAmount}</p>
      <p>運費：{shippingCost === 0 ? "未選擇" : `$${shippingCost}`}</p>
      <p>運費折抵：-${discount}</p>
      <hr className="my-2" />
      <h4 className="text-lg font-semibold">小計：${finalTotal}</h4>
    </div>
  );
};

export default CartFooter;
