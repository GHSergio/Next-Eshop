import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const OrderHistory: React.FC = () => {
  const orders = useSelector((state: RootState) => state.user.ordersHistory);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">訂單紀錄</h2>
      {orders.length === 0 ? (
        <p>您目前沒有任何訂單。</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.orderId}
              className="border border-gray-300 p-4 rounded-md"
            >
              <h3 className="font-semibold text-lg">
                訂單編號：{order.orderId}
              </h3>
              <p>訂單日期：{order.date}</p>
              {order.items.map((item) => (
                <div key={item.id} className="mt-2">
                  <p>
                    <strong>商品：</strong>
                    {item.title}
                  </p>
                  <p>
                    <strong>數量：</strong>
                    {item.quantity}
                  </p>
                  <p>
                    <strong>單價：</strong>${item.price}
                  </p>
                </div>
              ))}
              <p className="mt-2">
                <strong>總額：</strong>${order.totalAmount}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
