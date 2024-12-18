"use client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { setShippingCost, setSelectedPayment } from "@/store/slice/userSlice";
import CartFooter from "./CartFooter";

const DeliveryAndPayment = () => {
  const dispatch: AppDispatch = useDispatch();
  const selectedPayment = useSelector(
    (state: RootState) => state.user.selectedPayment
  );

  // console.log(selectedPayment);

  // 選擇哪種運送方式 & 需支付運費
  const handleOptionShipping = (option: string) => {
    switch (option) {
      // case "7-11":
      //   dispatch(setShippingCost(10));
      //   break;
      // case "family":
      //   dispatch(setShippingCost(10));
      //   break;
      case "c_store":
        dispatch(setShippingCost(10));
        break;
      case "delivery":
        dispatch(setShippingCost(15));
        break;
      case "credit":
        dispatch(setShippingCost(15));
        break;
      default:
        dispatch(setShippingCost(0));
    }
    // 使用 break 而非 return -> 否則會直接跳出函式 無法執行此行
    dispatch(setSelectedPayment(option)); // 更新 Redux 狀態
  };

  const deliveryOptions = [
    // { id: "7-11", label: "7-11 取貨付款", note: "滿 $100 元免運，運費 $10" },
    // { id: "family", label: "全家 取貨付款", note: "滿 $100 元免運，運費 $10" },
    {
      id: "c_store",
      label: "超商 取貨付款",
      note: "滿 100 元免運，運費 $10",
    },
    {
      id: "delivery",
      label: "宅配 貨到付款",
      note: "滿 120 元免運，運費 $15",
    },
    {
      id: "credit",
      label: "宅配 信用卡付款",
      note: "滿 120 元免運，運費 $15",
    },
  ];

  return (
    <div className="xs:p-0 md:p-4">
      {/* Delivery and Payment Options */}
      <div className="grid gap-4 xs:text-start md:text-center">
        {deliveryOptions.map((option) => (
          <label
            key={option.id}
            className={`flex items-center p-2 rounded-lg cursor-pointer ${
              selectedPayment === option.id
                ? "border-2 border-borderChecked"
                : "border border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="deliveryOption"
              value={option.id}
              checked={selectedPayment === option.id}
              onChange={() => handleOptionShipping(option.id)}
              className="xs:h-3 xs:w-3 md:h-4 md:w-4 rounded"
            />
            <div className="ml-4 flex flex-col text-left">
              <span className="font-semibold">{option.label}</span>
              <span className="text-sm text-gray-500">{option.note}</span>
            </div>
          </label>
        ))}
      </div>

      {/* Footer */}
      <CartFooter />
    </div>
  );
};

export default DeliveryAndPayment;
