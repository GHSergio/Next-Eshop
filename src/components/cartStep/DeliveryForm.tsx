"use client";
import React, { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { updateDeliveryCity } from "@/store/slice/deliveryLocationSlice";
import { renderInput, renderSelect } from "@/utils/formRenderers";
import { validateDeliveryInfo } from "@/utils/validators";
import { DeliveryInfo, DeliveryErrors } from "@/types";

interface DeliveryFormProps {
  user_id?: string;
  Info: DeliveryInfo;
  setInfo: (info: DeliveryInfo) => void;
  errors: DeliveryErrors;
  setErrors: (errors: DeliveryErrors) => void;
  onValidate: (isValid: boolean) => void;
  submitted: boolean;
}

const DeliveryForm: React.FC<DeliveryFormProps> = ({
  Info,
  setInfo,
  errors,
  setErrors,
  onValidate,
  submitted,
}) => {
  const dispatch = useDispatch();
  const cities = useSelector(
    (state: RootState) => state.deliveryLocation.cities
  );
  const districts = useSelector(
    (state: RootState) => state.deliveryLocation.districts
  );

  // 驗證 deliveryInfo 是否通過
  const validateForm = useCallback(() => {
    const newErrors = validateDeliveryInfo(Info);

    // 僅當錯誤狀態改變(單項符合驗證)時才執行
    if (JSON.stringify(errors) !== JSON.stringify(newErrors)) {
      // console.log(
      //   "比較差異:",
      //   "delivery:",
      //   errors.delivery,
      //   "newErrors:",
      //   newErrors
      // );
      setErrors(newErrors);
    }

    const isValid = !Object.values(newErrors).some((error) => error);
    onValidate(isValid);
  }, [Info, errors, setErrors, onValidate]);

  // 提交時觸發驗證
  useEffect(() => {
    if (submitted) validateForm();
  }, [submitted, validateForm]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      const updatedInfo = { ...Info, [name]: value };
      setInfo(updatedInfo);

      // 即時驗證並更新狀態
      const newErrors = validateDeliveryInfo(updatedInfo);
      const isValid = !Object.values(newErrors).some((error) => error);
      setErrors(newErrors);
      onValidate(isValid); // 即時更新 valid 狀態
    },
    [Info, setInfo, setErrors, onValidate]
  );

  // 自定義 錯誤提示訊息
  const handleSelectChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const { name, value } = event.target;
      let updatedInfo = { ...Info };

      // 更新不同的 state 依據 name 的值
      if (name === "city") {
        // 當選擇城市時 通知 storeLocationSlice 更新地區列表
        dispatch(updateDeliveryCity(value));
        // 更新 state 的 city 部分 & 清空 district
        updatedInfo = { ...Info, city: value, district: "" };
      } else if (name === "district") {
        // 更新 state 的 district 部分
        updatedInfo = { ...Info, district: value };
      }

      // 更新 Redux 的 deliveryInfo
      setInfo(updatedInfo);

      // 即時驗證並更新狀態
      const newErrors = validateDeliveryInfo(updatedInfo);
      const isValid = !Object.values(newErrors).some((error) => error);
      setErrors(newErrors);
      onValidate(isValid); // 即時更新 valid 狀態
    },
    [Info, setInfo, dispatch, setErrors, onValidate]
  );

  const errorMessages: { [key: string]: string } = {
    recipient_name: "姓名不能為空",
    phone: "請輸入有效的10位手機號碼",
    city: "請選擇縣市",
    district: "請選擇地區",
    address_line: "詳細地址不可為空",
  };

  return (
    <>
      {/* 選擇 宅配 / 信用卡 */}
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
      {renderInput({
        type: "text",
        id: "address_line",
        name: "address_line",
        label: "詳細地址",
        placeholder: "請輸入詳細地址",
        value: Info.address_line,
        onChange: handleInputChange,
        error: errors.address_line,
        errorMessage: errorMessages.address_line,
        submitted,
      })}
    </>
  );
};

export default DeliveryForm;
