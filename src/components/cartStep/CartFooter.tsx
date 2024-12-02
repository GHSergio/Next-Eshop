"use client";
import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { setShippingCost } from "@/store/slice/userSlice";

const CartFooter = () => {
  const dispatch = useDispatch();
  const selectedItems = useSelector(
    (state: RootState) => state.user.selectedItems
  );
  const selectedPayment = useSelector(
    (state: RootState) => state.user.selectedPayment
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

  // 動態調整運費折抵
  useEffect(() => {
    let adjustedShippingCost = shippingCost;

    switch (selectedPayment) {
      case "7-11":
      case "family":
        adjustedShippingCost = totalAmount > 100 ? 0 : shippingCost;
        break;
      case "delivery":
      case "credit":
        adjustedShippingCost = totalAmount > 120 ? 0 : shippingCost;
        break;
      default:
        adjustedShippingCost = shippingCost;
    }

    dispatch(setShippingCost(adjustedShippingCost));
  }, [selectedPayment, totalAmount, shippingCost, dispatch]);

  // 計算最終金額
  const finalTotal = useMemo(
    () => totalAmount + shippingCost,
    [totalAmount, shippingCost]
  );

  useEffect(() => {}, []);

  return (
    <div className="mt-4 space-y-3 text-right text-sm">
      <p>共 {calculateItemsCount} 件商品</p>
      <p>商品金額：$ {totalAmount.toFixed()}</p>
      <p>運費： $ {shippingCost}</p>
      {/* <p>活動折抵：-${discount}</p> */}
      <hr className="my-2" />
      <h4 className="text-lg font-semibold">小計：${finalTotal.toFixed()}</h4>
    </div>
  );
};

export default CartFooter;
