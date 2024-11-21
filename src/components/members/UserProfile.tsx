"use client";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
// import { useRouter } from "next/router";
// import ModifyProfile from "@/components/members/ModifyProfile";

const UserProfile: React.FC = () => {
  const userInfo = useSelector((state: RootState) => state.user.userInfo);

  // const router = useRouter();

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold mb-4">個人資料</h2>
      <p>電子郵件： {userInfo?.email}</p>
      <p>電話號碼： {userInfo?.phone}</p>
      <p>地址： {userInfo?.address}</p>
      <p>信用卡：**** **** **** {userInfo?.creditCardLast4}</p>
      {/* <button onClick={() => router.push("/modify-password")}>
        修改個人資料
      </button> */}
    </div>
  );
};

export default UserProfile;
