import React from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import CartFooter from "./CartFooter";

const ReviewOrder = () => {
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

  const commonTextClasses = () => "xs:text-xs md:text-sm";

  const commonSpanClasses = () =>
    "md:col-start-auto md:row-start-auto text-center text-textColor font-semibold xs:text-[0.5rem] md:text-sm";

  const paymentMethods = {
    "7-11": "7-11 取貨付款",
    family: "全家 取貨付款",
    delivery: "宅配 貨到付款",
    credit: "宅配 信用卡",
  };

  // console.log(selectedItems);
  return (
    <div className="xs:p-0 md:p-6">
      {/* 訂單個人資訊 */}
      <div className="grid gap-4 xs:text-start">
        {/* 根據付款和運送方式顯示不同資訊 */}
        {selectedPayment === "7-11" || selectedPayment === "family" ? (
          <>
            <h3 className="xs:text-sm md:text-lg font-semibold mb-2">
              超商取貨資訊
            </h3>
            <p className={`${commonTextClasses()}`}>
              付款方式 : {paymentMethods[selectedPayment] || "未知付款方式"}
            </p>
            <p className={`${commonTextClasses()}`}>
              訂購姓名 : {storeInfo.fullName}
            </p>
            <p className={`${commonTextClasses()}`}>
              聯絡方式 : {storeInfo.phone}
            </p>
            <p className={`${commonTextClasses()}`}>
              取貨門市 : {storeInfo.store}
            </p>
          </>
        ) : selectedPayment === "delivery" ? (
          <>
            <h3 className="xs:text-sm md:text-lg font-semibold mb-2">
              宅配收件資訊
            </h3>
            <p className={`${commonTextClasses()}`}>
              付款方式 : {paymentMethods[selectedPayment] || "未知付款方式"}
            </p>
            <p className={`${commonTextClasses()}`}>
              訂購姓名 : {deliveryInfo.fullName}
            </p>
            <p className={`${commonTextClasses()}`}>
              聯絡方式 : {deliveryInfo.phone}
            </p>
            <p className={`${commonTextClasses()}`}>
              收件地址 : {deliveryInfo.city}-{deliveryInfo.district}-
              {deliveryInfo.address}
            </p>
          </>
        ) : selectedPayment === "credit" ? (
          <>
            <h3 className="xs:text-sm md:text-lg font-semibold mb-2">
              信用卡付款資訊
            </h3>
            <p className={`${commonTextClasses()}`}>
              付款方式 : {paymentMethods[selectedPayment] || "未知付款方式"}
            </p>
            <p className={`${commonTextClasses()}`}>
              訂購姓名 : {deliveryInfo.fullName}
            </p>
            <p className={`${commonTextClasses()}`}>
              聯絡方式 : {deliveryInfo.phone}
            </p>
            <p className={`${commonTextClasses()}`}>
              收件地址 : {deliveryInfo.city}-{deliveryInfo.district}-
              {deliveryInfo.address}
            </p>
            <p className={`${commonTextClasses()}`}>
              信用卡號 : **** **** **** {creditCardInfo.cardNumber?.slice(-4)}
            </p>
          </>
        ) : null}
      </div>

      <hr className="my-4" />

      {/* 購物車內容 */}
      <h3 className="xs:text-md md:text-lg font-semibold mb-2">訂單內容</h3>
      <div className="grid gap-4 xs:text-start md:text-center">
        {selectedItems.map((item) => (
          <div
            key={item.id}
            className="grid xs:grid-cols-4 xs:grid-rows-4 md:grid-cols-12 md:grid-rows-1 items-center p-2 rounded-lg border border-gray-300"
          >
            {/* 商品名稱及顏色/尺寸 */}
            <div
              className={`w-[100px] xs:col-start-1 xs:row-start-1 xs:row-span-1 xs:col-span-2 md:col-span-4 md:col-start-auto md:row-start-auto md:col-span-auto md:row-span-auto flex flex-col justify-center`}
            >
              <span
                className="font-semibold text-textColor truncate xs:text-[0.5rem] md:text-sm"
                title={item.product_name}
              >
                {item.product_name}
              </span>
              <span className="text-xs text-textColor xs:text-[0.5rem] md:text-sm">
                {item.color || "N/A"} - {item.size || "N/A"}
              </span>
            </div>

            {/* 商品圖片 */}
            <div
              className={`xs:col-start-1 xs:row-start-2 xs:row-span-3 xs:col-span-2 md:col-span-2 md:col-start-auto md:row-start-auto md:col-span-auto md:row-span-auto`}
            >
              <Image
                src={item.product_image || "/path/to/default-image.jpg"}
                alt={item.product_name || "Image"}
                width={80}
                height={80}
                className="object-contain h-16 w-16 sm:h-20 sm:w-20"
                priority
              />
            </div>

            {/* 單價 */}
            <span
              className={`xs:block md:hidden xs:col-start-3 xs:row-start-2 xs:row-span-1 xs:col-span-1 md:col-span-2 ${commonSpanClasses()}`}
            >
              單價 :
            </span>
            <span
              className={`xs:col-start-4 xs:row-start-2 xs:row-span-1 xs:col-span-1 md:col-span-2 ${commonSpanClasses()}`}
            >
              $ {Math.ceil(item.product_price)}
            </span>

            {/* 數量 */}
            <span
              className={`xs:block md:hidden xs:col-start-3 xs:row-start-3 xs:row-span-1 xs:col-span-1 md:col-span-2 ${commonSpanClasses()}`}
            >
              數量:
            </span>
            <span
              className={`xs:col-start-4 xs:row-start-3 xs:row-span-1 xs:col-span-1 md:col-span-2 ${commonSpanClasses()}`}
            >
              {item.quantity}
            </span>

            {/* 總額 */}
            <span
              className={`xs:block md:hidden xs:col-start-3 xs:row-start-4 xs:row-span-1 xs:col-span-1 md:col-span-2 ${commonSpanClasses()}`}
            >
              小計:
            </span>
            <span
              className={`xs:col-start-4 xs:row-start-4 xs:row-span-1 xs:col-span-1 md:col-span-2 ${commonSpanClasses()}`}
            >
              $ {Math.ceil(item.product_price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      {/* CartFooter */}
      <div className="mt-6 text-right">
        <CartFooter />
      </div>
    </div>
  );
};

export default ReviewOrder;
