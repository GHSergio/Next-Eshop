"use client";
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setCreditCardInfo, setErrors } from "@/store/slice/userSlice";

interface CreditCardFormProps {
  submitted: boolean;
}

const CreditCardForm: React.FC<CreditCardFormProps> = ({ submitted }) => {
  const dispatch = useDispatch();
  const creditCardInfo = useSelector(
    (state: RootState) => state.user.creditCardInfo
  );
  const errors = useSelector((state: RootState) => state.user.errors);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      dispatch(setCreditCardInfo({ ...creditCardInfo, [name]: value }));

      dispatch(
        setErrors({
          ...errors,
          creditCard: { ...errors.creditCard, [name]: value.trim() === "" },
        })
      );
    },
    [dispatch, creditCardInfo, errors]
  );

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">支付細節</h2>

      {/* 卡號輸入框 */}
      <div>
        <label className="block text-sm font-medium">信用卡卡號</label>
        <input
          type="text"
          name="cardNumber"
          className={`mt-1 block w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            submitted && errors.creditCard.cardNumber
              ? "border-red-500"
              : "border-gray-300"
          }`}
          placeholder="請輸入16位信用卡號"
          onChange={handleChange}
          value={creditCardInfo.cardNumber}
        />
        {submitted && errors.creditCard.cardNumber && (
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
            submitted && errors.creditCard.expiryDate
              ? "border-red-500"
              : "border-gray-300"
          }`}
          placeholder="MM/YY"
          onChange={handleChange}
          value={creditCardInfo.expiryDate}
        />
        {submitted && errors.creditCard.expiryDate && (
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
            submitted && errors.creditCard.cvv
              ? "border-red-500"
              : "border-gray-300"
          }`}
          placeholder="請輸入3位數CVV"
          onChange={handleChange}
          value={creditCardInfo.cvv}
        />
        {submitted && errors.creditCard.cvv && (
          <p className="text-red-500 text-xs mt-1">請輸入3位數的CVV</p>
        )}
      </div>
    </>
  );
};

export default CreditCardForm;
