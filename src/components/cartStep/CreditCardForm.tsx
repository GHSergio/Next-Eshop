"use client";
import React, { useEffect, useCallback } from "react";
import { renderFormatInput } from "@/utils/formRenderers";
import { validateCreditCardInfo } from "@/utils/validators";
import { CreditCardInfo, CreditCardErrors } from "@/types";

interface CreditCardFormProps {
  user_id?: string;
  info: CreditCardInfo;
  setInfo: (info: CreditCardInfo) => void;
  errors: CreditCardErrors;
  setErrors: (errors: CreditCardErrors) => void;
  onValidate: (isValid: boolean) => void;
  submitted: boolean;
}

const CreditCardForm: React.FC<CreditCardFormProps> = ({
  info,
  setInfo,
  errors,
  setErrors,
  onValidate,
  submitted,
}) => {
  // 驗證 creditCardInfo 是否通過
  const validateForm = useCallback(() => {
    const newErrors = validateCreditCardInfo(info);

    // 僅當錯誤狀態改變(單項符合驗證)時才執行
    if (JSON.stringify(errors) !== JSON.stringify(newErrors)) {
      // console.log("比較差異:", "creditCard:", errors, "newErrors:", newErrors);
      setErrors(newErrors);
    }

    const isValid = !Object.values(newErrors).some((error) => error);
    onValidate(isValid);
  }, [info, errors, setErrors, onValidate]);

  // 提交時觸發驗證
  useEffect(() => {
    if (submitted) validateForm();
  }, [submitted, validateForm]);

  const formatCreditCardNumber = (value: string): string => {
    // 保證只允許數字輸入，並添加空格
    return value
      .replace(/\D/g, "") // 移除非數字字符
      .slice(0, 16) // 限制數字長度為 16
      .replace(/(\d{4})(?=\d)/g, "$1 "); // 每 4 位添加空格
  };

  const formatExpiryDate = (value: string): string => {
    if (!value) return ""; // 防止空值被清除

    // 移除非數字字符
    const numericValue = value.replace(/\D/g, "");

    // 獲取月份和年份
    let month = numericValue.slice(0, 2);
    const year = numericValue.slice(2, 4);

    // 處理月份：僅在用戶輸入完整兩位數後檢查範圍
    if (month.length === 2) {
      month = Math.min(parseInt(month, 10), 12).toString().padStart(2, "0");
    }

    // 格式化為 MM/YY，且不超過長度限制
    return `${month}${year ? `/${year}` : ""}`.slice(0, 5);
  };

  // const formatExpiryDate = (value: string): string => {
  //   if (!value) return ""; // 防止空值被清除
  //   return value
  //     .replace(/\D/g, "") // 僅保留數字
  //     .replace(/^(\d{2})(\d{0,2})/, "$1/$2") // 格式化為 MM/YY
  //     .slice(0, 5); // 限制長度
  // };

  const formatCvv = (value: string): string => {
    return value.replace(/\D/g, "").slice(0, 3); // 只允許3位數字
  };

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      if (name === "card_number") {
        const card_number = formatCreditCardNumber(value);
        setInfo({ ...info, card_number: card_number });
      }

      console.log(`Input Name: ${name}, Value: ${value}`);

      const updateInfo = { ...info, [name]: value };
      // 將target value set 到 creditCardInfo state
      setInfo(updateInfo);

      // 即時驗證並更新狀態
      const newErrors = validateCreditCardInfo(updateInfo);
      const isValid = !Object.values(newErrors).some((error) => error);
      setErrors(newErrors);
      onValidate(isValid); // 即時更新 valid 狀態
    },
    [info, onValidate, setErrors, setInfo]
  );

  const errorMessages: { [key: string]: string } = {
    card_number: "請輸入有效數字(16位)",
    expiry_date: "請輸入有效期限(月/年)",
    cvv: "請輸入有效數字(3位)",
  };

  return (
    <>
      {renderFormatInput({
        type: "text",
        id: "card_number",
        name: "card_number",
        label: "信用卡卡號",
        placeholder: "請輸入16位數字",
        value: info.card_number,
        onChange: handleChange,
        maxLength: 19, // 限制長度為19(16含空格)
        error: errors.card_number,
        errorMessage: errorMessages.card_number,
        submitted,
        formatter: formatCreditCardNumber,
      })}

      {renderFormatInput({
        type: "text",
        id: "expiry_date",
        name: "expiry_date",
        label: "有效期限 (MM/YY)",
        placeholder: "MM/YY",
        value: info.expiry_date,
        onChange: handleChange,
        error: errors.expiry_date,
        errorMessage: errorMessages.expiry_date,
        submitted,
        formatter: formatExpiryDate,
      })}

      {renderFormatInput({
        type: "text",
        id: "cvv",
        name: "cvv",
        label: "背面末三碼",
        placeholder: "請輸入3位數字",
        value: info.cvv,
        onChange: handleChange,
        maxLength: 3, // 限制長度為3
        error: errors.cvv,
        errorMessage: errorMessages.cvv,
        submitted,
        formatter: formatCvv,
      })}
    </>
  );
};

export default CreditCardForm;
