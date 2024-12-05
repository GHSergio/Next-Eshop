import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Image from "next/image";

interface OrderDetailsProps {
  orderId: string;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ orderId }) => {
  const currentOrderDetails = useSelector(
    (state: RootState) => state.user.currentOrderDetails
  );
  const orderDetail = currentOrderDetails[orderId];
  if (!orderDetail) {
    return <p>正在加載訂單詳細內容...</p>;
  }
  console.log(currentOrderDetails);

  const { order, items } = orderDetail;

  if (!order) {
    return <p>訂單主檔無法加載。</p>;
  }

  const commonTextClasses = () => "xs:text-xs md:text-sm";

  const commonSpanClasses = () =>
    "md:col-start-auto md:row-start-auto text-center text-textColor font-semibold xs:text-[0.5rem] md:text-sm";

  return (
    <>
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">訂單詳細內容</h3>
        {/* 訂單資訊 */}
        <div className="grid gap-4 xs:text-start">
          <p className={commonTextClasses()}>訂單編號：{order.id}</p>
          <p className={commonTextClasses()}>
            訂購日期：{new Date(order.created_at).toLocaleDateString()}
          </p>
          <p className={commonTextClasses()}>
            付款方式：{order.payment_method}
          </p>
          <p className={commonTextClasses()}>
            收件人姓名：{order.recipient_name}
          </p>
          <p className={commonTextClasses()}>
            聯絡電話：{order.recipient_phone}
          </p>
          {order.delivery_address ? (
            <p className={commonTextClasses()}>
              配送地址：{order.delivery_address}
            </p>
          ) : (
            <p className={commonTextClasses()}>取貨門市：{order.store_name}</p>
          )}
        </div>

        <hr className="my-4" />

        {/* 商品明細 */}
        <h3 className="xs:text-md md:text-lg font-semibold mb-2">商品明細</h3>
        <div className="grid gap-4 xs:text-start md:text-center">
          {items.map((item) => (
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
        {/* 訂單結算 */}
        <div className="mt-4 space-y-3 text-right text-sm">
          <p>共 {order.items_count} 件商品</p>
          <p>商品金額：$ {order.total_items_price.toFixed(2)}</p>
          <p>運費： $ {order.shipping_cost.toFixed(2)}</p>
          <hr className="my-2" />
          <h4 className="text-lg font-semibold">
            小計：${order.total_price.toFixed(2)}
          </h4>
        </div>
      </div>
      {/* </div> */}
    </>
  );
};

export default OrderDetails;
