import React from "react";
import Image from "next/image";
import { OrderItem, CartItem } from "@/types";

interface OrderItemDetailsProps {
  item: OrderItem | CartItem;
}

const OrderItemDetails: React.FC<OrderItemDetailsProps> = ({ item }) => {
  const commonSpanClasses = () =>
    "md:col-start-auto md:row-start-auto text-center text-textColor font-semibold xs:text-[0.7rem] md:text-sm";
  return (
    <div
      key={item.id}
      className="grid xs:grid-cols-4 xs:grid-rows-4 md:grid-cols-12 md:grid-rows-1 items-center p-2 rounded-lg border border-gray-300"
    >
      {/* 商品名稱及顏色/尺寸 */}
      <div
        className={`w-[100px] xs:col-start-1 xs:row-start-1 xs:row-span-1 xs:col-span-2 md:col-span-4 md:col-start-auto md:row-start-auto md:col-span-auto md:row-span-auto flex flex-col justify-center`}
      >
        <span
          className={`truncate ${commonSpanClasses()}`}
          title={item.product_name}
        >
          {item.product_name}
        </span>
        <span className={`${commonSpanClasses()}`}>
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
          className="object-contain bg-[#DDF0E9] h-20 w-20 sm:h-20 sm:w-20"
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
  );
};

export default OrderItemDetails;
