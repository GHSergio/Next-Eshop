"use client";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { setShippingCost } from "@/store/slice/userSlice";
import useCartCalculations from "@/hook/useCartCalculations";

const CartFooter = () => {
  const dispatch = useDispatch();
  const selectedPayment = useSelector(
    (state: RootState) => state.user.selectedPayment
  );
  const { calculateItemsCount, totalAmount, shippingCost, finalTotal } =
    useCartCalculations();

  // 動態調整運費折抵
  useEffect(() => {
    let adjustedShippingCost = shippingCost;

    switch (selectedPayment) {
      // case "7-11":
      // case "family":
      case "c_store":
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
