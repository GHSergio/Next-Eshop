import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import OrderItemDetails from "./OrderItemDetails";

interface OrderContentProps {
  orderId: string;
}

const OrderContent: React.FC<OrderContentProps> = ({ orderId }) => {
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
            <p className={commonTextClasses()}>
              取貨門市：{order.c_store} {order.store_name}
            </p>
          )}
        </div>

        <hr className="my-4" />

        {/* 商品明細 */}
        <h3 className="xs:text-md md:text-lg font-semibold mb-2">商品明細</h3>
        <div className="grid gap-4 xs:text-start md:text-center">
          {items.map((item) => (
            <OrderItemDetails key={item.id} item={item} />
          ))}
        </div>
        {/* 訂單結算 */}
        <div className="mt-4 space-y-3 text-right text-sm">
          <p>共 {order.items_count} 件商品</p>
          <p>商品金額：$ {Math.ceil(order.total_items_price)}</p>
          <p>運費： $ {order.shipping_cost}</p>
          <hr className="my-2" />
          <h4 className="text-lg font-semibold">小計：${order.total_price}</h4>
        </div>
      </div>
      {/* </div> */}
    </>
  );
};

export default OrderContent;
