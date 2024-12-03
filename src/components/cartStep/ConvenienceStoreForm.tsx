"use client";
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setStoreInfo, setErrors } from "@/store/slice/userSlice";
import {
  setStoreCity,
  setStoreDistrict,
  setStore,
} from "@/store/slice/storeLocationSlice";

interface ConvenienceStoreFormProps {
  submitted: boolean;
}

const ConvenienceStoreForm: React.FC<ConvenienceStoreFormProps> = ({
  submitted,
}) => {
  const dispatch = useDispatch();
  const storeInfo = useSelector((state: RootState) => state.user.storeInfo);
  const errors = useSelector((state: RootState) => state.user.errors);
  const cities = useSelector((state: RootState) => state.storeLocation.cities);
  const districts = useSelector(
    (state: RootState) => state.storeLocation.districts
  );
  const stores = useSelector((state: RootState) => state.storeLocation.stores);
  const storeLocation = useSelector((state: RootState) => state.storeLocation);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      // console.log(name, value);
      dispatch(setStoreInfo({ ...storeInfo, [name]: value }));
      // 動態地設置 name 對應的錯誤狀態，判斷該輸入框的值是否為空
      dispatch(
        setErrors({
          ...errors,
          store: { ...errors.store, [name]: value.trim() === "" },
        })
      );
    },
    [dispatch, errors, storeInfo]
  );

  const handleSelectChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const { name, value } = event.target;

      if (name === "city") {
        dispatch(setStoreCity(value)); // 更新城市並觸發 Redux 的地區更新
        dispatch(
          setStoreInfo({ ...storeInfo, city: value, district: "", store: "" })
        ); // 清空相關字段
      } else if (name === "district") {
        dispatch(setStoreDistrict(value)); // 更新地區並觸發 Redux 的門市更新
        dispatch(setStoreInfo({ ...storeInfo, district: value, store: "" })); // 清空門市字段
      } else if (name === "store") {
        dispatch(setStore(value)); // 更新選中的門市
        dispatch(setStoreInfo({ ...storeInfo, store: value })); // 更新 Redux storeInfo
      }

      dispatch(
        setErrors({
          ...errors,
          store: { ...errors.store, [name]: value.trim() === "" },
        })
      );
    },
    [dispatch, errors, storeInfo]
  );

  return (
    <>
      <h2 className="text-lg font-semibold mb-4">超商取貨資訊</h2>
      <div className="mb-4">
        <label className="block font-medium mb-1" htmlFor="fullName">
          姓名
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          placeholder="請輸入取件人姓名"
          value={storeInfo.fullName}
          onChange={handleChange}
          className={`w-full px-3 py-2 border ${
            submitted && errors.store.fullName
              ? "border-red-500"
              : "border-gray-300"
          } rounded`}
        />
        {submitted && errors.store.fullName && (
          <p className="text-red-500 text-sm mt-1">姓名為必填項</p>
        )}
      </div>

      {/* 手機號碼 */}
      <div className="mb-4">
        <label className="block font-medium mb-1" htmlFor="phone">
          手機
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          placeholder="請輸入聯絡電話"
          value={storeInfo.phone}
          onChange={handleChange}
          className={`w-full px-3 py-2 border ${
            submitted && errors.store.phone
              ? "border-red-500"
              : "border-gray-300"
          } rounded`}
        />
        {submitted && errors.store.phone && (
          <p className="text-red-500 text-sm mt-1">請輸入有效的手機號碼</p>
        )}
      </div>

      {/* 超商取貨地址選擇 */}
      <div className="mb-4">
        <label className="block font-medium mb-1" htmlFor="city">
          縣市
        </label>
        <select
          id="city"
          name="city"
          // value={storeInfo.city}
          value={storeLocation.selectedCity} // 確保 value 綁定到 Redux 狀態
          onChange={handleSelectChange}
          className={`w-full px-3 py-2 border ${
            submitted && errors.store.city
              ? "border-red-500"
              : "border-gray-300"
          } rounded`}
        >
          <option value="">選擇縣市</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
        {submitted && errors.store.city && (
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
          value={storeLocation.selectedDistrict} // 綁定到 Redux 狀態
          // value={storeInfo.district}
          onChange={handleSelectChange}
          className={`w-full px-3 py-2 border ${
            submitted && errors.store.district
              ? "border-red-500"
              : "border-gray-300"
          } rounded`}
        >
          <option value="">選擇地區</option>
          {districts.map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
        </select>
        {submitted && errors.store.district && (
          <p className="text-red-500 text-sm mt-1">地區為必填項</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1" htmlFor="store">
          門市
        </label>
        <select
          id="store"
          name="store"
          value={storeLocation.selectedStore} // 綁定到 Redux 狀態
          // value={storeInfo.store}
          onChange={handleSelectChange}
          className={`w-full px-3 py-2 border ${
            submitted && errors.store.store
              ? "border-red-500"
              : "border-gray-300"
          } rounded`}
        >
          <option value="">選擇門市</option>
          {stores.map((store) => (
            <option key={store.name} value={store.name}>
              {store.name}
            </option>
          ))}
        </select>
        {submitted && errors.store.store && (
          <p className="text-red-500 text-sm mt-1">門市為必填項</p>
        )}
      </div>
    </>
  );
};

export default ConvenienceStoreForm;
