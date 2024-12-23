"use client";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchOrderDetailsThunk } from "@/store/slice/userSlice";
import OrderContent from "./OrderContent";

const OrderHistory: React.FC = () => {
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [isDetailModdalOpen, setIsDetailModdalOpen] = useState<boolean>(false);
  const dispatch: AppDispatch = useDispatch();
  const ordersHistory = useSelector(
    (state: RootState) => state.user.ordersHistory
  );

  // console.log("訂單紀錄", ordersHistory);

  const handleViewDetails = (orderId: string) => {
    setActiveOrderId(orderId);
    setIsDetailModdalOpen(true); // 打開 Modal
    dispatch(fetchOrderDetailsThunk(orderId));
  };

  const handleCloseDetailModal = () => {
    setIsDetailModdalOpen(false); // 關閉 Modal
    setActiveOrderId(null); // 清空當前選擇的訂單
  };

  const thStyled =
    "w-1/4 xs:text-[0.8rem] md:text-sm text-textColor border p-1";
  const orderIdStyled =
    "w-1/4 xs:text-[0.8rem] md:text-sm border p-1 truncate overflow-hidden whitespace-nowrap text-ellipsis text-blue-500 cursor-pointer hover:underline";

  return (
    <div className="overflow-x-auto">
      <h2 className="xs:text-sm md:text-lg font-semibold mb-4">訂單紀錄</h2>
      {ordersHistory.length === 0 ? (
        <p>您目前沒有任何訂單。</p>
      ) : (
        <table className="w-full table-fixed border-collapse border text-center">
          <thead>
            <tr>
              <th className={thStyled}>訂購日期</th>
              <th className={thStyled}>訂單編號</th>
              <th className={thStyled}>處理進度</th>
              <th className={thStyled}>預計出貨日期</th>
            </tr>
          </thead>
          <tbody>
            {ordersHistory.map((order) => {
              const updatedDate = new Date(order.updated_at);
              updatedDate.setDate(updatedDate.getDate() + 5); // 加 5 天
              const formattedDate = updatedDate.toISOString().split("T")[0]; // 格式化成 YYYY-MM-DD

              return (
                <tr key={order.id}>
                  <td className={thStyled}>
                    {new Date(order.created_at).toISOString().split("T")[0]}
                  </td>
                  <td
                    className={orderIdStyled}
                    onClick={() => handleViewDetails(order.id)}
                    title={order.id}
                  >
                    {order.id}
                  </td>
                  {/* <td className={thStyled}>{order.payment_method}</td> */}
                  <td className={thStyled}>{order.status}</td>
                  <td className={thStyled}>{formattedDate}</td>
                  {/* 顯示加 5 天後的日期 */}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {activeOrderId && isDetailModdalOpen && (
        <OrderContent
          orderId={activeOrderId}
          onClose={handleCloseDetailModal}
        />
      )}
    </div>
  );
};

export default OrderHistory;
