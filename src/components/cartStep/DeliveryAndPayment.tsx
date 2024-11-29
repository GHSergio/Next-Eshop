"use client";
import React, { useState } from "react";
import CartFooter from "./CartFooter";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { setShippingCost } from "@/store/slice/userSlice";

const DeliveryAndPayment = () => {
  const dispatch: AppDispatch = useDispatch();
  const [selectedOption, setSelectedOption] = useState<string>("");

  const handleOptionShipping = (option: string) => {
    switch (option) {
      case "7-11":
        return dispatch(setShippingCost(50));
      case "family":
        return dispatch(setShippingCost(50));
      case "delivery":
        return dispatch(setShippingCost(60));
      case "credit":
        return dispatch(setShippingCost(60));
    }
    setSelectedOption(option);
  };

  const deliveryOptions = [
    { id: "7-11", label: "7-11 取貨付款", note: "滿 $1000 元免運，運費 $50" },
    { id: "family", label: "全家 取貨付款", note: "滿 $1000 元免運，運費 $50" },
    {
      id: "delivery",
      label: "宅配 貨到付款",
      note: "滿 1200 元免運，運費 $60",
    },
    {
      id: "credit",
      label: "宅配 信用卡付款",
      note: "滿 1200 元免運，運費 $60",
    },
  ];

  return (
    <div className="xs:p-0 md:p-4">
      {/* Delivery and Payment Options */}
      <div className="grid gap-4 xs:text-start md:text-center">
        {deliveryOptions.map((option) => (
          <label
            key={option.id}
            className={`flex items-center p-2 rounded-lg ${
              selectedOption === option.id
                ? "border-2 border-borderChecked"
                : "border border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="deliveryOption"
              value={option.id}
              checked={selectedOption === option.id}
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
