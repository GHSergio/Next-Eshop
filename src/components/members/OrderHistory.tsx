"use client";
import React from "react";
// import { useSelector } from "react-redux";
// import { RootState } from "@/store/store";

const OrderHistory: React.FC = () => {
  // const orders = useSelector((state: RootState) => state.user.ordersHistory);

  const orders = [
    {
      OrderId: "ORD12345",
      OrderDate: "2023-11-08",
      Total: 120.5,
      Items: [
        {
          Title: "Product A",
          Quantity: 2,
          PricePerUnit: 30.0,
        },
        { Title: "Product B", Quantity: 1, PricePerUnit: 60.5 },
      ],
    },
    {
      OrderId: "ORD67890",
      OrderDate: "2023-10-15",
      Total: 90.0,
      Items: [
        { Title: "Product C", Quantity: 3, PricePerUnit: 20.0 },
        { Title: "Product D", Quantity: 1, PricePerUnit: 30.0 },
      ],
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">訂單紀錄</h2>
      {orders.length === 0 ? (
        <p>您目前沒有任何訂單。</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.OrderId}
              className="border border-gray-300 p-4 rounded-md"
            >
              <h3 className="font-semibold text-lg">
                訂單編號：{order.OrderId}
              </h3>
              <p>訂單日期：{order.OrderDate}</p>
              {order.Items.map((item) => (
                <div key={item.Title} className="mt-2">
                  <p>
                    商品：
                    {item.Title}
                  </p>
                  <p>
                    數量：
                    {item.Quantity}
                  </p>
                  <p>單價：$ {item.PricePerUnit}</p>
                  <p>小計：$ {item.Quantity * item.PricePerUnit}</p>
                </div>
              ))}
              <p className="mt-2">總額：$ {order.Total}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
