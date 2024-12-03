"use client";
import React, {useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { setDeliveryInfo, setErrors } from "@/store/slice/userSlice";
import {
  setSelectedCity,
  setSelectedDistrict,
  setAddress,
} from "@/store/slice/locationSlice";

interface PaymentDetailsProps {
  submitted: boolean;
}

const DeliveryForm: React.FC<PaymentDetailsProps> = ({ submitted }) => {
  const dispatch = useDispatch();
  const deliveryInfo = useSelector(
    (state: RootState) => state.user.deliveryInfo
  );
  const errors = useSelector((state: RootState) => state.user.errors);
  const cities = useSelector((state: RootState) => state.location.cities);
  const districts = useSelector((state: RootState) => state.location.districts);
  const location = useSelector((state: RootState) => state.location);

  const updateErrors = useCallback(
    (name: string, value: string) => {
      dispatch(
        setErrors({
          ...errors,
          delivery: { ...errors.delivery, [name]: value.trim() === "" },
        })
      );
    },
    [dispatch, errors]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      if (name === "address") {
        dispatch(setAddress(value));
        dispatch(setDeliveryInfo({ ...deliveryInfo, address: value }));
      } else {
        dispatch(setDeliveryInfo({ ...deliveryInfo, [name]: value }));
      }

      // 修改其中的 `delivery`
      updateErrors(name, value);
    },
    [updateErrors, deliveryInfo, dispatch]
  );

  const handleSelectChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const { name, value } = event.target;

      // 更新不同的 state 依據 name 的值
      if (name === "city") {
        // 當選擇城市時，需要更新 Redux 的 selectedCity 和 districts
        dispatch(setSelectedCity(value));
        dispatch(
          setDeliveryInfo({ ...deliveryInfo, city: value, district: "" })
        );
      } else if (name === "district") {
        dispatch(setSelectedDistrict(value));
        dispatch(setDeliveryInfo({ ...deliveryInfo, district: value }));
      }

      // // 深拷貝當前的 `errors` 並修改其中的 `delivery`
      // const newDeliveryErrors = {
      //   ...errors.delivery,
      //   [name]: value.trim() === "",
      // };

      // 修改其中的 `delivery`
      updateErrors(name, value);
    },
    [updateErrors, deliveryInfo, dispatch]
  );

  return (
    <>
      {/* 選擇 宅配 / 信用卡 */}

      <h2 className="text-lg font-semibold mb-4">收件人資訊</h2>

      <div className="mb-4">
        <label className="block font-medium mb-1" htmlFor="fullName">
          姓名
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          placeholder="請輸入收件人姓名"
          value={deliveryInfo.fullName}
          onChange={handleChange}
          className={`w-full px-3 py-2 border ${
            submitted && errors.delivery.fullName
              ? "border-red-500"
              : "border-gray-300"
          } rounded`}
        />
        {submitted && errors.delivery.fullName && (
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
          placeholder="請輸入聯絡電話"
          value={deliveryInfo.phone}
          onChange={handleChange}
          className={`w-full px-3 py-2 border ${
            submitted && errors.delivery.phone
              ? "border-red-500"
              : "border-gray-300"
          } rounded`}
        />
        {submitted && errors.delivery.phone && (
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
          placeholder="請輸入Email"
          value={deliveryInfo.email}
          onChange={handleChange}
          className={`w-full px-3 py-2 border ${
            submitted && errors.delivery.email
              ? "border-red-500"
              : "border-gray-300"
          } rounded`}
        />
        {submitted && errors.delivery.email && (
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
          value={location.selectedCity}
          // value={deliveryInfo.city}
          onChange={handleSelectChange}
          className={`w-full px-3 py-2 border cursor-pointer ${
            submitted && errors.delivery.city
              ? "border-red-500"
              : "border-gray-300"
          } rounded`}
        >
          <option value="">選擇縣市</option>

          {cities.map((city) => (
            <option key={city.name} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
        {submitted && errors.delivery.city && (
          <p className="text-red-500 text-sm mt-1">縣市為必填項</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1" htmlFor="district">
          地區
        </label>
        <select
          id="district"
          name="district"
          value={location.selectedDistrict}
          // value={deliveryInfo.district}
          onChange={handleSelectChange}
          className={`w-full px-3 py-2 border cursor-pointer ${
            submitted && errors.delivery.district
              ? "border-red-500"
              : "border-gray-300"
          } rounded`}
        >
          <option value="">選擇地區</option>
          {districts.map((district) => (
            <option key={district.name} value={district.name}>
              {district.name}
            </option>
          ))}
        </select>
        {submitted && errors.delivery.district && (
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
          placeholder="請輸入收件地址"
          value={location.address}
          // value={deliveryInfo.address}
          onChange={handleChange}
          className={`w-full px-3 py-2 border ${
            submitted && errors.delivery.address
              ? "border-red-500"
              : "border-gray-300"
          } rounded`}
        />
        {submitted && errors.delivery.address && (
          <p className="text-red-500 text-sm mt-1">地址為必填項</p>
        )}
      </div>
    </>
  );
};

export default DeliveryForm;
