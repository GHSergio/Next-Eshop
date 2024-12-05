"use client";
import React, { useState, useEffect } from "react";
import UserProfile from "@/components/members/UserProfile";
import OrderHistory from "@/components/members/OrderHistory";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchOrdersThunk } from "@/store/slice/userSlice";
const MemberPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("profile");
  const ordersHistory = useSelector(
    (state: RootState) => state.user.ordersHistory
  );

  // 當切換到 "訂單紀錄" 時，調用 `fetchOrders`
  useEffect(() => {
    const authId = JSON.parse(localStorage.getItem("userData") || "{}").id;
    if (authId) {
      if (activeTab === "orders" && ordersHistory.length === 0) {
        dispatch(fetchOrdersThunk(authId));
      }
    }
  }, [activeTab, dispatch, ordersHistory.length]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">會員中心</h1>

      {/* Tab 選單 */}
      <div className="flex space-x-4 border-b border-gray-300 pb-2 mb-4">
        <button
          onClick={() => setActiveTab("profile")}
          className={`${
            activeTab === "profile"
              ? "text-blue-500 font-bold"
              : "text-gray-500"
          }`}
        >
          個人資料
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`${
            activeTab === "orders" ? "text-blue-500 font-bold" : "text-gray-500"
          }`}
        >
          訂單紀錄
        </button>
        <button
          onClick={() => setActiveTab("modifyPassword")}
          className={`${
            activeTab === "modify-password"
              ? "text-blue-500 font-bold"
              : "text-gray-500"
          }`}
        >
          修改密碼
        </button>
      </div>

      {/* 動態內容顯示 */}
      <div>
        {activeTab === "profile" && <UserProfile />}
        {activeTab === "orders" && <OrderHistory />}
        {/* {activeTab === "modify-password" && <ModifyPassword />} */}
      </div>
    </div>
  );
};

export default MemberPage;
