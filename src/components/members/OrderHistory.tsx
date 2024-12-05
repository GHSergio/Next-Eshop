"use client";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchOrderDetailsThunk } from "@/store/slice/userSlice";
import OrderDetails from "./OrderDetails";

const OrderHistory: React.FC = () => {
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const dispatch: AppDispatch = useDispatch();
  const ordersHistory = useSelector(
    (state: RootState) => state.user.ordersHistory
  );

  console.log("訂單紀錄", ordersHistory);

  const handleViewDetails = (orderId: string) => {
    setActiveOrderId(orderId);
    dispatch(fetchOrderDetailsThunk(orderId));
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">訂單紀錄</h2>
      {ordersHistory.length === 0 ? (
        <p>您目前沒有任何訂單。</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">訂購日期</th>
              <th className="border border-gray-300 p-2">訂單編號</th>
              <th className="border border-gray-300 p-2">付款方式</th>
              <th className="border border-gray-300 p-2">處理進度</th>
              <th className="border border-gray-300 p-2">預計出貨日期</th>
              <th className="border border-gray-300 p-2">操作</th>
            </tr>
          </thead>
          <tbody>
            {ordersHistory.map((order) => (
              <tr key={order.id}>
                <td className="border border-gray-300 p-2">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
                <td
                  className="border border-gray-300 p-2 text-blue-500 cursor-pointer"
                  onClick={() => handleViewDetails(order.id)}
                >
                  {order.id}
                </td>
                <td className="border border-gray-300 p-2">
                  {order.payment_method}
                </td>
                <td className="border border-gray-300 p-2">{order.status}</td>
                <td className="border border-gray-300 p-2">
                  {new Date(order.updated_at).toLocaleDateString(undefined, {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <button
                    onClick={() => handleViewDetails(order.id)}
                    className="text-blue-500 hover:underline"
                  >
                    查看詳細
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {activeOrderId && <OrderDetails orderId={activeOrderId} />}
    </div>
  );
};

export default OrderHistory;
