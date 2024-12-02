"use client";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  DeliveryForm,
  CreditCardForm,
  ConvenienceStoreForm,
} from "@/components/cartStep";

interface PaymentDetailsProps {
  submitted: boolean;
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({ submitted }) => {
  const selectedPayment = useSelector(
    (state: RootState) => state.user.selectedPayment
  );

  return (
    <>
      {/* 選擇 超商 貨到付款 */}
      {(selectedPayment === "7-11" || selectedPayment === "family") && (
        <div className="p-4">
          <ConvenienceStoreForm submitted={submitted} />
        </div>
      )}

      {/* 選擇 宅配 / 信用卡 */}
      {(selectedPayment === "delivery" || selectedPayment === "credit") && (
        <div className="p-4">
          <DeliveryForm submitted={submitted} />
        </div>
      )}

      {/* 信用卡 */}

      {selectedPayment === "credit" && (
        <div className="p-4">
          <CreditCardForm submitted={submitted} />
        </div>
      )}
    </>
  );
};

export default PaymentDetails;
