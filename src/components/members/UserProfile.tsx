import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const UserProfile: React.FC = () => {
  const userInfo = useSelector((state: RootState) => state.user.userInfo);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">個人資料</h2>
      <p>
        <strong>帳戶名稱：</strong> {userInfo?.name}
      </p>
      <p>
        <strong>電子郵件：</strong> {userInfo?.email}
      </p>
      <p>
        <strong>電話號碼：</strong> {userInfo?.phone}
      </p>
      <p>
        <strong>地址：</strong> {userInfo?.address}
      </p>
      <p>
        <strong>信用卡：</strong> **** **** **** {userInfo?.creditCardLast4}
      </p>
    </div>
  );
};

export default UserProfile;
