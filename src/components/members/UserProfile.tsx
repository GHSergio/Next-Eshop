"use client";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { supabase } from "@/supabaseClient";
import { fetchUserData } from "@/store/slice/userSlice";

const UserProfile: React.FC = () => {
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const dispatch: AppDispatch = useDispatch();

  // 本地狀態管理編輯模式
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string>("");

  const handleEditClick = (field: string, currentValue: string) => {
    setEditingField(field);
    setTempValue(currentValue);
  };

  const handleSaveClick = async () => {
    if (!editingField) return;

    const fieldMapping: Record<string, string> = {
      //interface 映射到 : DB table
      fullName: "username",
      phone: "phone",
      defaultShippingAddress: "default_shipping_address",
      preferredPaymentMethod: "preferred_payment_method",
      membershipType: "membership_type",
    };

    const dbField = fieldMapping[editingField];

    // 更新數據到後端
    const { error } = await supabase
      .from("users")
      .update({ [dbField]: tempValue })
      .eq("auth_id", userInfo?.id); // 關聯 `auth_id`

    if (error) {
      alert("更新失敗：" + error.message);
    } else {
      alert("更新成功！");
      dispatch(fetchUserData()); // 重新獲取數據
      setEditingField(null); // 關閉編輯模式
    }
  };

  const handleCancelClick = () => {
    setEditingField(null); // 退出編輯模式
  };

  const renderEditableField = (
    label: string,
    field: string,
    value: string | null | undefined
  ) => (
    <div className="flex items-center space-x-2">
      <label className="font-semibold text-textColor">{label}：</label>
      {editingField === field ? (
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className="border p-1 rounded"
          />
          <button
            onClick={handleSaveClick}
            className="bg-blue-500 text-white px-2 py-1 rounded"
          >
            保存
          </button>
          <button
            onClick={handleCancelClick}
            className="bg-gray-300 px-2 py-1 rounded"
          >
            取消
          </button>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <span className="text-textColor font-thin">{value || "未提供"}</span>
          <button
            onClick={() => handleEditClick(field, value || "")}
            className="text-blue-500 underline"
          >
            編輯
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">個人資料</h2>
      <div>{renderEditableField("全名", "fullName", userInfo?.fullName)}</div>
      <div>{renderEditableField("電話號碼", "phone", userInfo?.phone)}</div>
      <div>
        {renderEditableField(
          "收件地址",
          "defaultShippingAddress",
          userInfo?.defaultShippingAddress
        )}
      </div>
      <div>
        {renderEditableField(
          "支付方式",
          "preferredPaymentMethod",
          userInfo?.preferredPaymentMethod
        )}
      </div>
      <div>
        {renderEditableField(
          "會員等級",
          "membershipType",
          userInfo?.membershipType
        )}
      </div>
      <div>
        <p>
          登入方式：<span>{userInfo?.provider || "未指定"}</span>
        </p>
      </div>
      <div>
        <p>
          電子郵件：<span>{userInfo?.email || "未提供"}</span>
        </p>
      </div>
      <div>
        <p>
          最後修改時間：
          <span>
            {userInfo?.updatedAt
              ? new Date(userInfo.updatedAt).toLocaleString()
              : "尚未修改"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default UserProfile;
