// src/app/cart/CartPage.tsx
"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import CartSummary from "../../components/cartStep/CartSummary";
import ShippingInformation from "../../components/cartStep/ShippingInformation";
import PaymentDetails from "../../components/cartStep/PaymentDetails";
import ReviewOrder from "../../components/cartStep/ReviewOrder";
import { useDispatch } from "react-redux";
import { clearCart } from "../../store/slice/productSlice";
import { useRouter } from "next/navigation";
import {
  PaymentInfo,
  ShippingInfo,
  Errors,
  SelectedItem,
} from "@/components/cartStep/types";

const steps = ["確認購物車", "運送資訊", "付費方式", "確認訂單"];

const CartPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: "",
    phone: "",
    email: "",
    city: "",
    area: "",
    address: "",
  });
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  const [errors, setErrors] = useState<Errors>({
    shipping: {
      fullName: true,
      phone: true,
      email: true,
      city: true,
      area: true,
      address: true,
    },
    payment: {
      cardNumber: true,
      expiryDate: true,
      cvv: true,
    },
  });
  const [submitted, setSubmitted] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  const validateShippingInfo = useCallback((): boolean => {
    const newErrors = {
      fullName: shippingInfo.fullName.trim() === "",
      phone: !/^\d{10}$/.test(shippingInfo.phone),
      email: !/^\S+@\S+\.\S+$/.test(shippingInfo.email),
      city: shippingInfo.city.trim() === "",
      area: shippingInfo.area.trim() === "",
      address: shippingInfo.address.trim() === "",
    };
    setErrors((prev) => ({ ...prev, shipping: newErrors }));
    return !Object.values(newErrors).some((error) => error);
  }, [shippingInfo]);

  const validatePaymentInfo = useCallback((): boolean => {
    const newErrors = {
      cardNumber: !/^\d{16}$/.test(paymentInfo.cardNumber),
      expiryDate: paymentInfo.expiryDate.trim() === "",
      cvv: !/^\d{3}$/.test(paymentInfo.cvv),
    };
    setErrors((prev) => ({ ...prev, payment: newErrors }));
    return !Object.values(newErrors).some((error) => error);
  }, [paymentInfo]);

  const handleNext = useCallback(() => {
    setSubmitted(true);
    let valid = true;
    if (activeStep === 1) {
      valid = validateShippingInfo();
    } else if (activeStep === 2) {
      valid = validatePaymentInfo();
    }
    if (valid) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setSubmitted(false);
    }
  }, [
    activeStep,
    // shippingInfo,
    // paymentInfo,
    validateShippingInfo,
    validatePaymentInfo,
  ]);

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleClearCart = useCallback(() => {
    dispatch(clearCart());
  }, [dispatch]);

  // 渲染內容
  const renderStepContent = useCallback(
    (step: number) => {
      switch (step) {
        case 0:
          return (
            <CartSummary
              selectAll={selectAll}
              setSelectAll={setSelectAll}
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
            />
          );
        case 1:
          return (
            <ShippingInformation
              onInfoChange={setShippingInfo}
              shippingInfo={shippingInfo}
              submitted={submitted}
              errors={errors.shipping}
              setErrors={(newErrors) =>
                setErrors((prev) => ({ ...prev, shipping: newErrors }))
              }
            />
          );
        case 2:
          return (
            <PaymentDetails
              onPaymentChange={setPaymentInfo}
              paymentInfo={paymentInfo}
              submitted={submitted}
              errors={errors.payment}
              setErrors={(newErrors) =>
                setErrors((prev) => ({ ...prev, payment: newErrors }))
              }
            />
          );
        case 3:
          return (
            <ReviewOrder
              paymentInfo={paymentInfo}
              shippingInfo={shippingInfo}
              selectedItems={selectedItems}
            />
          );
        default:
          return (
            <div className="text-center mt-4">
              <h2 className="text-xl mb-2">成功完成訂單流程！</h2>
              <button
                onClick={handleClearCart}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                返回主頁面
              </button>
            </div>
          );
      }
    },
    [
      errors.payment,
      errors.shipping,
      handleClearCart,
      paymentInfo,
      selectAll,
      selectedItems,
      shippingInfo,
      submitted,
    ]
  );
  // const renderStepContent = () => {
  //   return (
  //     <ReviewOrder paymentInfo={paymentInfo} shippingInfo={shippingInfo} />
  //   );
  // };

  const stepContent = useMemo(
    () => renderStepContent(activeStep),
    [
      activeStep,
      // selectedItems,
      // shippingInfo,
      // paymentInfo,
      // errors,
      // submitted,
      renderStepContent,
    ]
  );

  useEffect(() => {
    if (activeStep === steps.length) {
      handleClearCart();
      const timer = setTimeout(() => {
        router.push("/");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [activeStep, handleClearCart, router]);

  console.log("選擇的商品: ", selectedItems);
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
