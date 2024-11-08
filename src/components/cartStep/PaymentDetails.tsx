"use client";

import React, { useCallback } from "react";
import { PaymentInfo, Errors } from "./types";

interface PaymentDetailsProps {
  onPaymentChange: (info: PaymentInfo) => void;
  paymentInfo: PaymentInfo;
  submitted: boolean;
  errors: Errors["payment"];
  setErrors: (errors: Errors["payment"]) => void;
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({
  onPaymentChange,
  submitted,
  errors,
  paymentInfo,
  setErrors,
}) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      const newErrors = { ...errors };

      // 實時驗證
      if (name === "cardNumber" && !/^\d{16}$/.test(value)) {
        newErrors.cardNumber = true;
      } else if (name === "expiryDate") {
        newErrors.expiryDate = value.trim() === "";
      } else if (name === "cvv" && !/^\d{3}$/.test(value)) {
        newErrors.cvv = true;
      } else {
        newErrors[name as keyof typeof errors] = value.trim() === "";
      }

      setErrors(newErrors);

      onPaymentChange({ ...paymentInfo, [name]: value } as PaymentInfo);
    },
    [errors, onPaymentChange, paymentInfo, setErrors]
  );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">支付細節</h2>

      {/* 卡號輸入框 */}
      <div>
        <label className="block text-sm font-medium">信用卡卡號</label>
        <input
          type="text"
          name="cardNumber"
          className={`mt-1 block w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            submitted && errors.cardNumber
              ? "border-red-500"
              : "border-gray-300"
          }`}
          placeholder="請輸入16位信用卡號"
          onChange={handleChange}
          value={paymentInfo.cardNumber}
        />
        {submitted && errors.cardNumber && (
          <p className="text-red-500 text-xs mt-1">請輸入16位有效的信用卡號</p>
        )}
      </div>

      {/* 有效期限輸入框 */}
      <div>
        <label className="block text-sm font-medium">有效期限 月/年</label>
        <input
          type="month"
          name="expiryDate"
          className={`mt-1 block w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            submitted && errors.expiryDate
              ? "border-red-500"
              : "border-gray-300"
          }`}
          placeholder="MM/YY"
          onChange={handleChange}
          value={paymentInfo.expiryDate}
        />
        {submitted && errors.expiryDate && (
          <p className="text-red-500 text-xs mt-1">
            請輸入有效的有效期限 (MM/YY)
          </p>
        )}
      </div>

      {/* CVV輸入框 */}
      <div>
        <label className="block text-sm font-medium">背面末三碼</label>
        <input
          type="password"
          name="cvv"
          className={`mt-1 block w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            submitted && errors.cvv ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="請輸入3位數CVV"
          onChange={handleChange}
          value={paymentInfo.cvv}
        />
        {submitted && errors.cvv && (
          <p className="text-red-500 text-xs mt-1">請輸入3位數的CVV</p>
        )}
      </div>
    </div>
  );
};

export default PaymentDetails;
