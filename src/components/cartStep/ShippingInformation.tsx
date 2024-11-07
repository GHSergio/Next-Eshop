"use client";

import React, { useCallback } from "react";

interface ShippingInformationProps {
  onInfoChange: (info: any) => void;
  shippingInfo: {
    fullName: string;
    phone: string;
    email: string;
    city: string;
    area: string;
    address: string;
  };
  submitted: boolean;
  errors: {
    fullName: boolean;
    phone: boolean;
    email: boolean;
    city: boolean;
    area: boolean;
    address: boolean;
  };
  setErrors: (errors: any) => void;
}

const ShippingInformation: React.FC<ShippingInformationProps> = ({
  onInfoChange,
  shippingInfo,
  submitted,
  errors,
  setErrors,
}) => {
  //處理TextField
  const handleTextFieldChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      const newErrors = { ...errors };

      if (name === "phone" && !/^\d{10}$/.test(value)) {
        newErrors.phone = true;
      } else if (name === "email" && !/^\S+@\S+\.\S+$/.test(value)) {
        newErrors.email = true;
      } else {
        newErrors[name as keyof typeof errors] = value.trim() === "";
      }

      setErrors(newErrors);
      onInfoChange((prevInfo: any) => ({ ...prevInfo, [name]: value }));
    },
    [errors, onInfoChange, setErrors]
  );

  const handleSelectChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const { name, value } = event.target;
      const newErrors = { ...errors };

      newErrors[name as keyof typeof errors] = value.trim() === "";

      setErrors(newErrors);
      onInfoChange((prevInfo: any) => ({ ...prevInfo, [name]: value }));
    },
    [errors, onInfoChange, setErrors]
  );

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">收件人資訊</h2>

      <div className="mb-4">
        <label className="block font-medium mb-1" htmlFor="fullName">
          姓名
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={shippingInfo.fullName}
          onChange={handleTextFieldChange}
          className={`w-full px-3 py-2 border ${
            submitted && errors.fullName ? "border-red-500" : "border-gray-300"
          } rounded`}
        />
        {submitted && errors.fullName && (
          <p className="text-red-500 text-sm mt-1">姓名為必填項</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1" htmlFor="phone">
          手機
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={shippingInfo.phone}
          onChange={handleTextFieldChange}
          className={`w-full px-3 py-2 border ${
            submitted && errors.phone ? "border-red-500" : "border-gray-300"
          } rounded`}
        />
        {submitted && errors.phone && (
          <p className="text-red-500 text-sm mt-1">請輸入有效的手機號碼</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1" htmlFor="email">
          信箱
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={shippingInfo.email}
          onChange={handleTextFieldChange}
          className={`w-full px-3 py-2 border ${
            submitted && errors.email ? "border-red-500" : "border-gray-300"
          } rounded`}
        />
        {submitted && errors.email && (
          <p className="text-red-500 text-sm mt-1">請輸入有效的電子郵件地址</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1" htmlFor="city">
          縣市
        </label>
        <select
          id="city"
          name="city"
          value={shippingInfo.city}
          onChange={handleSelectChange}
          className={`w-full px-3 py-2 border ${
            submitted && errors.city ? "border-red-500" : "border-gray-300"
          } rounded`}
        >
          <option value="">選擇縣市</option>
          <option value="台北市">台北市</option>
          <option value="台中市">台中市</option>
          <option value="高雄市">高雄市</option>
        </select>
        {submitted && errors.city && (
          <p className="text-red-500 text-sm mt-1">縣市為必填項</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1" htmlFor="area">
          地區
        </label>
        <select
          id="area"
          name="area"
          value={shippingInfo.area}
          onChange={handleSelectChange}
          className={`w-full px-3 py-2 border ${
            submitted && errors.area ? "border-red-500" : "border-gray-300"
          } rounded`}
        >
          <option value="">選擇地區</option>
          <option value="大安區">大安區</option>
          <option value="中山區">中山區</option>
          <option value="信義區">信義區</option>
        </select>
        {submitted && errors.area && (
          <p className="text-red-500 text-sm mt-1">地區為必填項</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1" htmlFor="address">
          地址
        </label>
        <input
          type="text"
          id="address"
          name="address"
          value={shippingInfo.address}
          onChange={handleTextFieldChange}
          className={`w-full px-3 py-2 border ${
            submitted && errors.address ? "border-red-500" : "border-gray-300"
          } rounded`}
        />
        {submitted && errors.address && (
          <p className="text-red-500 text-sm mt-1">地址為必填項</p>
        )}
      </div>
    </div>
  );
};

export default ShippingInformation;
