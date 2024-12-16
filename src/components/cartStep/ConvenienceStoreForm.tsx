"use client";
import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  updateStoreCities,
  updateStoreDistricts,
  updateStoreRoadSections,
  updateStores,
} from "@/store/slice/storeLocationSlice";
import { StoreInfo, StoreErrors } from "@/types";
import { renderInput, renderSelect } from "@/utils/formRenderers";
import { validateStoreInfo } from "@/utils/validators";

interface ConvenienceStoreFormProps {
  user_id?: string;
  Info: StoreInfo;
  setInfo: (info: StoreInfo) => void;
  errors: StoreErrors;
  setErrors: (errors: StoreErrors) => void;
  onValidate: (isValid: boolean) => void;
  submitted: boolean;
}

const ConvenienceStoreForm: React.FC<ConvenienceStoreFormProps> = ({
  Info,
  setInfo,
  errors,
  setErrors,
  onValidate,
  submitted,
}) => {
  const dispatch = useDispatch();
  const cStores = useSelector(
    (state: RootState) => state.storeLocation.cStores
  );
  const cities = useSelector((state: RootState) => state.storeLocation.cities);
  const districts = useSelector(
    (state: RootState) => state.storeLocation.districts
  );
  const roadSections = useSelector(
    (state: RootState) => state.storeLocation.roadSections
  );
  const stores = useSelector((state: RootState) => state.storeLocation.stores);

  // 驗證 StoreInfo 是否通過
  const validateForm = useCallback(() => {
    const newErrors = validateStoreInfo(Info);

    // 僅當錯誤狀態改變(單項符合驗證)時才執行
    if (JSON.stringify(errors) !== JSON.stringify(newErrors)) {
      console.log("比較差異:", "store:", errors, "newErrors:", newErrors);
      // setErrors({ ...errors, store: newErrors });
      setErrors(newErrors);
    }

    const isValid = !Object.values(newErrors).some((error) => error);
    onValidate(isValid);
  }, [Info, errors, onValidate, setErrors]);

  // 提交時觸發驗證
  useEffect(() => {
    if (submitted) validateForm();
  }, [submitted, validateForm]);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      const updatedInfo = { ...Info, [name]: value };
      setInfo(updatedInfo);
      // 即時驗證並更新狀態
      const newErrors = validateStoreInfo(updatedInfo);
      const isValid = !Object.values(newErrors).some((error) => error);
      setErrors(newErrors);
      onValidate(isValid); // 即時更新 valid 狀態
    },
    [Info, setErrors, setInfo, onValidate]
  );

  const handleSelectChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const { name, value } = event.target;
      let updatedInfo = { ...Info };

      if (name === "c_store") {
        // 通知 storeLocationSlice 更新city列表
        dispatch(updateStoreCities(value));
        // 更新 state 的 city 部分 & 清空 city以下項目
        updatedInfo = {
          ...Info,
          c_store: value,
          city: "",
          district: "",
          road_section: "",
          store_name: "",
          store_address: "",
          // store: {
          //   store_name: "",
          //   store_address: "",
          // },
        };
      } else if (name === "city") {
        dispatch(updateStoreDistricts(value));
        updatedInfo = {
          ...Info,
          city: value,
          district: "",
          road_section: "",
          store_name: "",
          store_address: "",
          // store: {
          //   store_name: "",
          //   store_address: "",
          // },
        };
      } else if (name === "district") {
        dispatch(updateStoreRoadSections(value));
        updatedInfo = {
          ...Info,
          district: value,
          road_section: "",
          store_name: "",
          store_address: "",
          // store: {
          //   store_name: "",
          //   store_address: "",
          // },
        };
      } else if (name === "road_section") {
        dispatch(updateStores(value));
        updatedInfo = {
          ...Info,
          road_section: value,
          store_name: "",
          store_address: "",
          // store: {
          //   store_name: "",
          //   store_address: "",
          // },
        };
      } else if (name === "store") {
        const selectedStore = stores.find(
          (store) => store.store_name === value
        );
        // const selectedAddress = stores.find((store) => store.address === value);
        if (selectedStore) {
          updatedInfo = {
            ...Info,
            store_name: selectedStore.store_name,
            store_address: selectedStore.store_address,
            // store: {
            //   store_name: selectedStore.name,
            //   store_address: selectedStore.address,
            // },
          };
        }
      }
      // 更新 Redux 的 deliveryInfo
      setInfo(updatedInfo);

      // 即時驗證並更新狀態
      const newErrors = validateStoreInfo(updatedInfo);
      const isValid = !Object.values(newErrors).some((error) => error);
      setErrors(newErrors);
      onValidate(isValid); // 即時更新 valid 狀態
    },
    [dispatch, Info, stores, onValidate, setErrors, setInfo]
  );

  // 自定義 錯誤提示訊息
  const errorMessages: { [key: string]: string } = {
    recipient_name: "姓名不能為空",
    phone: "請輸入有效的10位手機號碼",
    c_store: "請選擇超商類型",
    city: "請選擇縣市",
    district: "請選擇地區",
    road_section: "請選擇路段",
    store: "請選擇門市",
  };

  // console.log("Updated storeInfo:", storeInfo);
  // console.log("Cities options:", cities);

  return (
    <>
      {/* Input */}
      {renderInput({
        type: "text",
        id: "recipient_name",
        name: "recipient_name",
        label: "姓名",
        placeholder: "請輸入取件人姓名",
        value: Info.recipient_name,
        onChange: handleInputChange,
        error: errors.recipient_name,
        errorMessage: errorMessages.recipient_name,
        submitted,
      })}
      {renderInput({
        type: "text",
        id: "phone",
        name: "phone",
        label: "手機",
        placeholder: "請輸入聯絡電話",
        value: Info.phone,
        onChange: handleInputChange,
        error: errors.phone,
        errorMessage: errorMessages.phone,
        submitted,
      })}

      {/* Select */}
      {renderSelect({
        id: "c_store",
        name: "c_store",
        label: "超商類型",
        value: Info.c_store,
        options: cStores,
        onChange: handleSelectChange,
        error: errors.c_store,
        submitted,
      })}
      {renderSelect({
        id: "city",
        name: "city",
        label: "縣市",
        value: Info.city,
        options: cities,
        onChange: handleSelectChange,
        error: errors.city,
        submitted,
      })}
      {renderSelect({
        id: "district",
        name: "district",
        label: "地區",
        value: Info.district,
        options: districts,
        onChange: handleSelectChange,
        error: errors.district,
        submitted,
      })}
      {renderSelect({
        id: "road_section",
        name: "road_section",
        label: "路段",
        value: Info.road_section,
        options: roadSections,
        onChange: handleSelectChange,
        error: errors.road_section,
        submitted,
      })}
      {renderSelect({
        id: "store",
        name: "store",
        label: "門市",
        value: Info.store_name,
        // options: stores, // 傳入 object[]
        options: stores.map((store) => store.store_name), // 提取 store_name 列表
        onChange: handleSelectChange,
        error: errors.store_name,
        submitted,
      })}
    </>
  );
};

export default ConvenienceStoreForm;
