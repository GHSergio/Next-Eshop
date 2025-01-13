import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import CartFooter from "./CartFooter";
import OrderItemDetails from "../members/OrderItemDetails";
const ReviewOrder = () => {
  const selectedItems = useSelector(
    (state: RootState) => state.user.selectedItems
  );
  const selectedPayment = useSelector(
    (state: RootState) => state.user.selectedPayment
  );
  const deliveryInfo = useSelector(
    (state: RootState) => state.user.delivery_info
  );
  const creditCardInfo = useSelector(
    (state: RootState) => state.user.creditCard_info
  );
  const storeInfo = useSelector((state: RootState) => state.user.store_info);
  // const c_store = useSelector(
  //   (state: RootState) => state.user.store_info.c_store
  // );

  const commonTextClasses = () => "xs:text-xs md:text-sm";

  const paymentMethods = {
    // c_store: `${c_store} 取貨付款`,
    c_store: "超商 取貨付款",
    delivery: "宅配 貨到付款",
    credit: "宅配 信用卡",
  };

  // console.log(selectedItems);
  return (
    <div className="xs:p-0 md:p-6">
      {/* 訂單個人資訊 */}
      <div className="grid gap-4 xs:text-start">
        {/* 根據付款和運送方式顯示不同資訊 */}
        {selectedPayment === "c_store" ? (
          <>
            <h3 className="xs:text-sm md:text-lg font-semibold mb-2">
              超商取貨資訊
            </h3>
            <p className={`${commonTextClasses()}`}>
              付款方式 : {paymentMethods[selectedPayment] || "未知付款方式"}
            </p>
            <p className={`${commonTextClasses()}`}>
              訂購姓名 : {storeInfo.recipient_name}
            </p>
            <p className={`${commonTextClasses()}`}>
              聯絡方式 : {storeInfo.phone}
            </p>
            <p className={`${commonTextClasses()}`}>
              取貨門市 : {storeInfo.c_store} {storeInfo.store_name}
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
              訂購姓名 : {deliveryInfo.recipient_name}
            </p>
            <p className={`${commonTextClasses()}`}>
              聯絡方式 : {deliveryInfo.phone}
            </p>
            <p className={`${commonTextClasses()}`}>
              收件地址 :{" "}
              {`${deliveryInfo.city} ${deliveryInfo.district} ${deliveryInfo.address_line}`}
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
              訂購姓名 : {deliveryInfo.recipient_name}
            </p>
            <p className={`${commonTextClasses()}`}>
              聯絡方式 : {deliveryInfo.phone}
            </p>
            <p className={`${commonTextClasses()}`}>
              收件地址 :{" "}
              {`${deliveryInfo.city} ${deliveryInfo.district} ${deliveryInfo.address_line}`}
            </p>
            <p className={`${commonTextClasses()}`}>
              信用卡號 : **** **** **** {creditCardInfo.card_number?.slice(-4)}
            </p>
          </>
        ) : null}
      </div>

      <hr className="my-4" />

      {/* 購物車內容 */}
      <h3 className="xs:text-md md:text-lg font-semibold mb-2">訂單內容</h3>
      <div className="grid gap-4 xs:text-start md:text-center">
        {selectedItems.map((item) => (
          <OrderItemDetails key={item.id} item={item} />
        ))}
      </div>

      {/* CartFooter */}
      <div className="mt-6 text-right">
        {/* 傳遞 prop 隱藏運費提示 */}
        <CartFooter showRemainingShippingMessage={false} />
      </div>
    </div>
  );
};

export default ReviewOrder;
