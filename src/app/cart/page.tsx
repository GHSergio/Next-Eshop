// src/app/cart/CartPage.tsx
"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  CartSummary,
  DeliveryAndPayment,
  PaymentDetails,
  ReviewOrder,
} from "@/components/cartStep";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { clearCart, setErrors } from "@/store/slice/userSlice";

const steps = ["確認購物車", "付費方式&運送資訊", "填寫資料", "確認訂單"];

const CartPage: React.FC = () => {
  const selectedItems = useSelector(
    (state: RootState) => state.user.selectedItems
  );
  const selectedPayment = useSelector(
    (state: RootState) => state.user.selectedPayment
  );
  const deliveryInfo = useSelector(
    (state: RootState) => state.user.deliveryInfo
  );
  const creditCardInfo = useSelector(
    (state: RootState) => state.user.creditCardInfo
  );
  const storeInfo = useSelector((state: RootState) => state.user.storeInfo);
  const errors = useSelector((state: RootState) => state.user.errors);
  const [activeStep, setActiveStep] = useState(0);

  const [submitted, setSubmitted] = useState(false);

  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();

  // 填寫項目驗證
  const validatePaymentDetails = useCallback((): boolean => {
    let isDeliveryValid = true;
    let isStoreValid = true;
    let isCreditCardValid = true;

    if (selectedPayment === "delivery") {
      const newDeliveryErrors = {
        fullName: deliveryInfo.fullName.trim() === "",
        phone: !/^\d{10}$/.test(deliveryInfo.phone),
        email: !/^\S+@\S+\.\S+$/.test(deliveryInfo.email),
        city: deliveryInfo.city.trim() === "",
        district: deliveryInfo.district.trim() === "",
        address: deliveryInfo.address.trim() === "",
      };
      // 取出 newDeliveryErrors 對象中所有屬性的值，返回一個陣列
      // 如果 some 返回 false，表示沒有任何錯誤，則取反後變成 true。
      isDeliveryValid = !Object.values(newDeliveryErrors).some(
        (error) => error
      );
      // 僅更新 delivery 錯誤部分
      dispatch(setErrors({ ...errors, delivery: newDeliveryErrors }));
    }

    if (selectedPayment === "7-11" || selectedPayment === "family") {
      const newStoreErrors = {
        fullName: storeInfo.fullName.trim() === "",
        phone: !/^\d{10}$/.test(storeInfo.phone),
        city: storeInfo.city.trim() === "",
        district: storeInfo.district.trim() === "",
        store: storeInfo.store.trim() === "",
      };
      isStoreValid = !Object.values(newStoreErrors).some((error) => error);
      // 僅更新 store 錯誤部分
      dispatch(setErrors({ ...errors, store: newStoreErrors }));
    }

    if (selectedPayment === "credit") {
      const newCreditCardErrors = {
        cardNumber: !/^\d{16}$/.test(creditCardInfo.cardNumber),
        expiryDate: creditCardInfo.expiryDate.trim() === "",
        cvv: !/^\d{3}$/.test(creditCardInfo.cvv),
      };
      isCreditCardValid = !Object.values(newCreditCardErrors).some(
        (error) => error
      );
      // 僅更新 creditCard 錯誤部分
      dispatch(setErrors({ ...errors, creditCard: newCreditCardErrors }));
    }

    return isDeliveryValid && isStoreValid && isCreditCardValid;
  }, [
    selectedPayment,
    deliveryInfo,
    storeInfo,
    creditCardInfo,
    errors,
    dispatch,
  ]);

  const handleNext = useCallback(() => {
    setSubmitted(true);
    let valid = true;

    if (activeStep === 2) {
      valid = validatePaymentDetails();
    }
    if (valid) {
      setActiveStep((prev) => prev + 1);
      setSubmitted(false);
    }
  }, [activeStep, validatePaymentDetails]);

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // 渲染內容
  const renderStepContent = useCallback(
    (step: number) => {
      switch (step) {
        case 0:
          return <CartSummary />;
        case 1:
          return <DeliveryAndPayment />;

        case 2:
          return <PaymentDetails submitted={submitted} />;
        case 3:
          return <ReviewOrder />;
        default:
          return (
            <div className="text-center mt-4">
              <h2 className="text-xl mb-2">成功完成訂單流程！</h2>
              <button
                onClick={() => clearCart()}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                返回主頁面
              </button>
            </div>
          );
      }
    },
    [submitted]
  );

  const stepContent = useMemo(
    () => renderStepContent(activeStep),
    [activeStep, renderStepContent]
  );

  useEffect(() => {
    if (activeStep === steps.length) {
      dispatch(clearCart());
      const timer = setTimeout(() => {
        router.push("/");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [activeStep, router, dispatch]);

  // console.log("選擇的商品: ", selectedItems);
  return (
    <div className="max-w-4xl mx-auto xs:p-2 md:p-4">
      {/* 步驟流程 - 顯示在流程內容上方 */}
      <div className="flex items-center justify-between mb-6">
        {steps.map((label, index) => (
          <React.Fragment key={label}>
            <div className="xs:text-[0.6rem] md:text-sm flex flex-col items-center">
              {/* 步驟數字 */}
              <div
                className={`flex items-center justify-center xs:w-4 xs:h-4 md:w-8 md:h-8 rounded-full font-bold ${
                  index <= activeStep
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                {index + 1}
              </div>
              {/* 步驟文字 */}
              <span
                className={`xs:text-[0.6rem] md:text-sm font-semibold mt-2 ${
                  index <= activeStep ? "text-blue-500" : "text-gray-400"
                }`}
              >
                {label}
              </span>
            </div>

            {/* 步驟之間的線條 */}
            {index < steps.length - 1 && (
              <div className="flex-1 mx-2">
                <span
                  className={`block w-full border-t-2 ${
                    index < activeStep ? "border-blue-500" : "border-gray-300"
                  }`}
                ></span>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* 流程內容區塊 */}
      <div className="border border-gray-300 rounded-lg p-4">{stepContent}</div>

      {/* 下方的步驟控制按鈕 */}
      {activeStep < steps.length && (
        <div className="flex justify-between mt-4">
          <button
            disabled={activeStep === 0}
            onClick={handleBack}
            className={`bg-gray-300 text-black px-4 py-2 rounded-md ${
              activeStep === 0 ? "cursor-not-allowed opacity-50" : ""
            }`}
          >
            上一步
          </button>
          {/* 第一步未選任何商品時禁用 */}
          <button
            disabled={activeStep === 0 && selectedItems.length === 0}
            onClick={handleNext}
            className={`px-4 py-2 rounded-md ${
              activeStep === 0 && selectedItems.length === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
                : "bg-blue-500 text-white"
            }`}
          >
            {activeStep === steps.length - 1 ? "下訂單" : "下一步"}
          </button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
