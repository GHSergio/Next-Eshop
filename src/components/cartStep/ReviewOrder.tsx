import React, { useMemo } from "react";
import Image from "next/image";
import { ShippingInfo, PaymentInfo } from "./types";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
// import { CartItem } from "@/store/slice/types";
// import CartFooter from "./CartFooter";

interface ReviewOrderProps {
  shippingInfo: ShippingInfo;
  paymentInfo: PaymentInfo;
}

const ReviewOrder: React.FC<ReviewOrderProps> = ({
  shippingInfo,
  paymentInfo,
}) => {
  const selectedItems = useSelector(
    (state: RootState) => state.user.selectedItems
  );
  const shippingCost = useSelector(
    (state: RootState) => state.user.shippingCost
  );
  const totalAmount = useMemo(() => {
    return selectedItems.reduce(
      (total, item) => total + Math.floor(item.product_price * item.quantity),
      0
    );
  }, [selectedItems]);

  const discount = totalAmount > 1000 ? shippingCost : 0;
  const finalTotal = totalAmount + shippingCost - discount;

  const commonTextClasses = () => "xs:text-xs md:text-sm";

  const commonSpanClasses = () =>
    "md:col-start-auto md:row-start-auto text-center text-textColor font-semibold xs:text-[0.5rem] md:text-sm";

  // console.log(selectedItems);
  return (
    <div className="xs:p-0 md:p-6">
      <h2 className="xs:text-md md:text-xl font-semibold mb-4">確認您的訂單</h2>
      <hr className="my-4" />

      <h3 className="xs:text-sm md:text-lg font-semibold mb-2">收件人資訊</h3>
      <p className={`${commonTextClasses()}`}>姓名: {shippingInfo.fullName}</p>
      <p className={`${commonTextClasses()}`}>手機: {shippingInfo.phone}</p>
      <p className={`${commonTextClasses()}`}>縣市: {shippingInfo.city}</p>
      <p className={`${commonTextClasses()}`}>地區: {shippingInfo.area}</p>
      <p className={`${commonTextClasses()}`}>地址: {shippingInfo.address}</p>

      <hr className="my-4" />

      <h3 className="xs:text-sm md:text-lg font-semibold mb-2">付款資訊</h3>
      <p className={`${commonTextClasses()}`}>
        信用卡號: **** **** **** {paymentInfo.cardNumber?.slice(-4)}
      </p>
      <p className={`${commonTextClasses()}`}>
        有效期限: {paymentInfo.expiryDate}
      </p>
      <p className={`${commonTextClasses()}`}>背面末三碼: ***</p>

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
              <span className="font-semibold text-textColor truncate xs:text-[0.5rem] md:text-sm">
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
              $ {item.product_price}
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
              $ {Math.floor(item.product_price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 text-right">
        <h3 className="xs:text-[0.8rem] md:text-lg font-bold text-textColor">
          總計: ${totalAmount}
          總計: ${finalTotal}
        </h3>
      </div>
    </div>
  );
};

export default ReviewOrder;
