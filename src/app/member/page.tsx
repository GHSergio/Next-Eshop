"use client";
import React, { useState, useEffect } from "react";
import MyAddresses from "@/components/members/MyAddresses";
import OrderHistory from "@/components/members/OrderHistory";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { fetchOrdersThunk } from "@/store/slice/userSlice";
const MemberPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("");

  // 當切換到 "訂單紀錄" 時，調用 `fetchOrders`
  useEffect(() => {
    // 從 localStorage 中獲取key:"userData" 的值。
    const userData = localStorage.getItem("userData");
    // 假如有(沒有該key會回傳null) 從JSON 格式轉換成 JS object
    const authId = userData ? JSON.parse(userData).id : null;
    if (activeTab === "orders") {
      dispatch(fetchOrdersThunk(authId));
    }
  }, [activeTab, dispatch]);

  const tabFontStyle = "xs:text-sm md:text-md text-blue-500 font-bold";

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="xs:text:md md:text-2xl font-bold mb-4">會員中心</h1>

      {/* Tab 選單 */}
      <div className="flex space-x-4 border-b border-gray-300 pb-2 mb-4">
        <button
          onClick={() => setActiveTab("address")}
          className={`${tabFontStyle} ${
            activeTab === "address" ? "text-blue-500" : "text-gray-500"
          }`}
        >
          地址&門市
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`${tabFontStyle} ${
            activeTab === "orders" ? "text-blue-500" : "text-gray-500"
          }`}
        >
          訂單紀錄
        </button>
        {/* <button
          onClick={() => setActiveTab("modifyPassword")}
          className={`${tabFontStyle} ${
            activeTab === "modify-password" ? "text-blue-500" : "text-gray-500"
          }`}
        >
          修改密碼
        </button> */}
      </div>

      {/* 動態內容顯示 */}
      <div>
        {/* {activeTab === "profile" && <UserProfile />} */}
        {activeTab === "address" && <MyAddresses />}
        {activeTab === "orders" && <OrderHistory />}
        {/* {activeTab === "modify-password" && <ModifyPassword />} */}
      </div>
    </div>
  );
};

export default MemberPage;
