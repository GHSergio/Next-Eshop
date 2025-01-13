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
  setSelectedItems,
  saveOrderThunk,
  deleteCartItemThunk,
  setAlert,
} from "@/store/slice/userSlice";
import useCartCalculations from "@/hook/useCartCalculations";

const steps = ["購物車內容", "選擇付費方式", "填寫詳細資料", "確認訂單內容"];

const CartPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();

  const selectedItems = useSelector(
    (state: RootState) => state.user.selectedItems
  );
  const selectedPayment = useSelector(
    (state: RootState) => state.user.selectedPayment
  );

  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const storeInfo = useSelector((state: RootState) => state.user.store_info);
  const deliveryInfo = useSelector(
    (state: RootState) => state.user.delivery_info
  );
  const addresses = useSelector((state: RootState) => state.user.addresses);
  const stores = useSelector((state: RootState) => state.user.stores);
  const isCreditCardFormValid = useSelector(
    (state: RootState) => state.user.isCreditCardFormValid
  );

  const { product_amount, product_price, shippingCost, finalTotal } =
    useCartCalculations();

  const [activeStep, setActiveStep] = useState(0);
  // onClick下一步 狀態改為true -> 觸發表單驗證 -> 未通過則顯示錯誤提示
  const [submitted, setSubmitted] = useState(false);
  const [isOrderSubmitted, setIsOrderSubmitted] = useState(false);

  // 在組件掛載時重置
  useEffect(() => {
    setIsOrderSubmitted(false); // 重置提交狀態
  }, []);

  // 提交訂單邏輯(支付資訊&商品明細)
  const handleConfirmOrder = useCallback(async () => {
    if (!userInfo?.id) {
      alert("未登入用戶，無法提交訂單！");
      return;
    }

    const paymentMethods = {
      c_store: "超商 取貨付款",
      delivery: "宅配 貨到付款",
      credit: "宅配 信用卡",
    };

    const payment_method =
      selectedPayment in paymentMethods
        ? paymentMethods[selectedPayment as keyof typeof paymentMethods]
        : "未知付款方式";

    // 依支付方式顯示
    const paymentInfo = {
      payment_method,
      recipient_name:
        selectedPayment === "c_store"
          ? storeInfo.recipient_name
          : deliveryInfo.recipient_name,
      phone:
        selectedPayment === "c_store" ? storeInfo.phone : deliveryInfo.phone,
      delivery_address:
        selectedPayment === "delivery" || selectedPayment === "credit"
          ? `${deliveryInfo.city} ${deliveryInfo.district} ${deliveryInfo.address_line}`
          : null,
      c_store: selectedPayment === "c_store" ? storeInfo.c_store : null,
      store_name: selectedPayment === "c_store" ? storeInfo.store_name : null,
      store_address:
        selectedPayment === "c_store" ? storeInfo.store_address : null,
    };

    // 訂單
    const newOrder = {
      auth_id: userInfo.id,
      total_price: finalTotal,
      items_count: product_amount,
      total_items_price: product_price,
      shipping_cost: shippingCost,
      payment_method: paymentInfo.payment_method,
      recipient_name: paymentInfo.recipient_name,
      recipient_phone: paymentInfo.phone,
      delivery_address: paymentInfo.delivery_address || null,
      c_store: paymentInfo.c_store || null,
      store_name: paymentInfo.store_name || null,
      store_address: paymentInfo.store_address || null,
      status: "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    // 訂單商品明細
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
    product_amount,
    deliveryInfo.address_line,
    deliveryInfo.city,
    deliveryInfo.district,
    deliveryInfo.recipient_name,
    deliveryInfo.phone,
    finalTotal,
    selectedItems,
    selectedPayment,
    shippingCost,
    storeInfo.recipient_name,
    storeInfo.phone,
    storeInfo.c_store,
    storeInfo.store_name,
    storeInfo.store_address,
    product_price,
    userInfo?.id,
    dispatch,
  ]);

  // 下一步
  const handleNext = useCallback(async () => {
    if (activeStep === 2) {
      setSubmitted(true);

      // 超商取貨判斷
      if (selectedPayment === "c_store" && stores.length === 0) {
        dispatch(
          setAlert({
            open: true,
            message: "請選擇取貨門市",
            severity: "info",
          })
        );
        return;
      }

      // 宅配判斷
      if (selectedPayment === "delivery" && addresses.length === 0) {
        dispatch(
          setAlert({
            open: true,
            message: "請選擇收件地址",
            severity: "info",
          })
        );
        return;
      }

      // 信用卡判斷
      if (
        selectedPayment === "credit" &&
        (addresses.length === 0 || !isCreditCardFormValid)
      ) {
        dispatch(
          setAlert({
            open: true,
            message:
              addresses.length === 0 ? "請選擇收件地址" : "請確認填寫所有資訊",
            severity: "info",
          })
        );
        return;
      }
    }

    // 如果是最後一步，執行訂單提交邏輯
    if (activeStep === steps.length - 1) {
      await handleConfirmOrder();
      setIsOrderSubmitted(true);
    }

    // 前進到下一步
    setActiveStep((prev) => prev + 1);
    setSubmitted(false); // 重置表單提交狀態
  }, [
    dispatch,
    activeStep,
    selectedPayment,
    handleConfirmOrder,
    addresses.length,
    stores.length,
    isCreditCardFormValid,
  ]);

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
              <p className="text-sm text-white mb-4">
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

  // console.log("Selected payment method:", selectedPayment);
  // console.log("Store Info:", storeInfo);
  // console.log("Errors:", errors.store);

  // 提交後 跳轉
  useEffect(() => {
    if (isOrderSubmitted) {
      const timer = setTimeout(() => {
        router.push("/"); // 跳轉回首頁
        setIsOrderSubmitted(false); // 跳轉後重置狀態
      }, 2000);

      return () => clearTimeout(timer); // 清理計時器，防止內存洩漏
    }
  }, [isOrderSubmitted, router]);

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
              activeStep === 0 ? "invisible" : ""
            }`}
          >
            上一步
          </button>

          {/* 第一步未選任何商品時禁用 */}
          <button
            disabled={
              (activeStep === 0 && selectedItems.length === 0) ||
              (activeStep === 1 && selectedPayment === "")
            }
            onClick={handleNext}
            className={`px-4 py-2 rounded-md ${
              (activeStep === 0 && selectedItems.length === 0) ||
              (activeStep === 1 && selectedPayment === "")
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
