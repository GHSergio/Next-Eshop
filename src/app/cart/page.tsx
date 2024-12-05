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
import {
  clearCart,
  setErrors,
  setSelectedItems,
  saveOrderThunk,
  deleteCartItemThunk,
} from "@/store/slice/userSlice";
import useCartCalculations from "@/hook/useCartCalculations";

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
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const { calculateItemsCount, totalAmount, shippingCost, finalTotal } =
    useCartCalculations();
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

  // 提交訂單邏輯(支付資訊&商品明細)
  const handleConfirmOrder = useCallback(async () => {
    if (!userInfo?.id) {
      alert("未登入用戶，無法提交訂單！");
      return;
    }

    const paymentMethods = {
      "7-11": "7-11 取貨付款",
      family: "全家 取貨付款",
      delivery: "宅配 貨到付款",
      credit: "宅配 信用卡",
    };

    const payment_method =
      selectedPayment in paymentMethods
        ? paymentMethods[selectedPayment as keyof typeof paymentMethods]
        : "未知付款方式";

    const paymentInfo = {
      payment_method,
      recipient_name:
        selectedPayment === "7-11" || selectedPayment === "family"
          ? storeInfo.fullName
          : deliveryInfo.fullName,
      recipient_phone:
        selectedPayment === "7-11" || selectedPayment === "family"
          ? storeInfo.phone
          : deliveryInfo.phone,
      delivery_address:
        selectedPayment === "delivery" || selectedPayment === "credit"
          ? `${deliveryInfo.city}-${deliveryInfo.district}-${deliveryInfo.address}`
          : null,
      store_name:
        selectedPayment === "7-11" || selectedPayment === "family"
          ? storeInfo.store
          : null,
    };

    const newOrder = {
      // id: "", // 在資料庫插入後由資料庫自動生成
      user_id: userInfo.id,
      total_price: finalTotal,
      items_count: calculateItemsCount,
      total_items_price: totalAmount,
      shipping_cost: shippingCost,
      payment_method: paymentInfo.payment_method,
      recipient_name: paymentInfo.recipient_name,
      recipient_phone: paymentInfo.recipient_phone,
      delivery_address: paymentInfo.delivery_address || null,
      store_name: paymentInfo.store_name || null,
      status: "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const orderItems = selectedItems.map((item) => ({
      product_id: item.product_id,
      product_name: item.product_name,
      product_image: item.product_image,
      product_price: item.product_price,
      quantity: item.quantity,
      color: item.color,
      size: item.size,
      subtotal: item.product_price * item.quantity,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    try {
      const result = await dispatch(
        saveOrderThunk({ newOrder, orderItems })
      ).unwrap();
      console.log("提交成功，返回的結果：", result);
      // 刪除購物車中的項目
      for (const item of selectedItems) {
        await dispatch(deleteCartItemThunk(item.id));
      }
      dispatch(setSelectedItems([])); // 清空 selectedItems
    } catch (error) {
      console.error("提交失敗，錯誤信息：", error);
      alert("提交訂單失敗，請稍後再試！");
    }
  }, [
    calculateItemsCount,
    deliveryInfo.address,
    deliveryInfo.city,
    deliveryInfo.district,
    deliveryInfo.fullName,
    deliveryInfo.phone,
    finalTotal,
    selectedItems,
    selectedPayment,
    shippingCost,
    storeInfo.fullName,
    storeInfo.phone,
    storeInfo.store,
    totalAmount,
    userInfo?.id,
    dispatch,
  ]);

  const handleNext = useCallback(async () => {
    setSubmitted(true);
    let valid = true;

    if (activeStep === 2) {
      valid = validatePaymentDetails();
    }
    // 如果是最後一步，執行訂單提交邏輯
    if (activeStep === steps.length - 1) {
      if (valid) {
        await handleConfirmOrder();
        setActiveStep((prev) => prev + 1);
      }
    } else if (valid) {
      // 其他步驟，直接前進
      setActiveStep((prev) => prev + 1);
      setSubmitted(false);
    }
  }, [activeStep, validatePaymentDetails, handleConfirmOrder]);

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
              <h2 className="text-xl mb-2 font-semibold text-green-600">
                訂單已成功提交！
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                您的訂單已提交成功，您可以到{" "}
                <a href="/member" className="text-blue-500 underline">
                  會員中心
                </a>{" "}
                查詢您的訂單進度。
              </p>
              <button
                onClick={() => router.push("/")}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                返回首頁
              </button>
            </div>
          );
      }
    },
    [submitted, router]
  );

  const stepContent = useMemo(
    () => renderStepContent(activeStep),
    [activeStep, renderStepContent]
  );

  // useEffect(() => {
  //   if (activeStep === steps.length) {
  //     dispatch(clearCart());
  //     const timer = setTimeout(() => {
  //       router.push("/");
  //     }, 2000);

  //     return () => clearTimeout(timer);
  //   }
  // }, [activeStep, router, dispatch]);

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
