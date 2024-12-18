"use client";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import {
  DeliveryForm,
  CreditCardForm,
  ConvenienceStoreForm,
} from "@/components/cartStep";
import {
  setStoreValidity,
  setDeliveryValidity,
  setCreditCardValidity,
  setStoreInfo,
  setDeliveryInfo,
  setCreditCardInfo,
  setErrors,
} from "@/store/slice/userSlice";
import { CreditCardErrors, DeliveryErrors, StoreErrors } from "@/types";

interface PaymentDetailsProps {
  submitted: boolean;
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({ submitted }) => {
  const dispatch: AppDispatch = useDispatch();
  // Redux state
  const selectedPayment = useSelector(
    (state: RootState) => state.user.selectedPayment
  );
  const deliveryInfo = useSelector(
    (state: RootState) => state.user.delivery_info
  );
  const storeInfo = useSelector((state: RootState) => state.user.store_info);
  const creditCardInfo = useSelector(
    (state: RootState) => state.user.creditCard_info
  );
  const errors = useSelector((state: RootState) => state.user.errors);

  const setDeliveryErrors = (deliveryErrors: DeliveryErrors) => {
    dispatch(setErrors({ ...errors, delivery: deliveryErrors }));
  };

  const setStoreErrors = (storeErrors: StoreErrors) => {
    dispatch(setErrors({ ...errors, store: storeErrors }));
  };

  const setCreditCardErrors = (creditCardErrors: CreditCardErrors) => {
    dispatch(setErrors({ ...errors, creditCard: creditCardErrors }));
  };

  return (
    <>
      {/* 選擇 超商 貨到付款 */}
      {selectedPayment === "c_store" && (
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">超商取貨資訊</h2>

          <ConvenienceStoreForm
            info={storeInfo}
            setInfo={(info) => dispatch(setStoreInfo(info))}
            errors={errors.store}
            setErrors={setStoreErrors}
            onValidate={(isValid) => dispatch(setStoreValidity(isValid))}
            submitted={submitted}
          />
        </div>
      )}

      {/* 選擇 宅配 / 信用卡 */}
      {(selectedPayment === "delivery" || selectedPayment === "credit") && (
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">收件人資訊</h2>

          <DeliveryForm
            info={deliveryInfo}
            setInfo={(info) => dispatch(setDeliveryInfo(info))}
            errors={errors.delivery}
            setErrors={setDeliveryErrors}
            onValidate={(isValid) => dispatch(setDeliveryValidity(isValid))}
            submitted={submitted}
          />
        </div>
      )}

      {/* 信用卡 */}
      {selectedPayment === "credit" && (
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">支付細節</h2>

          <CreditCardForm
            info={creditCardInfo}
            setInfo={(info) => dispatch(setCreditCardInfo(info))}
            errors={errors.creditCard}
            setErrors={setCreditCardErrors}
            onValidate={(isValid) => dispatch(setCreditCardValidity(isValid))}
            submitted={submitted}
          />
        </div>
      )}
    </>
  );
};

export default PaymentDetails;
