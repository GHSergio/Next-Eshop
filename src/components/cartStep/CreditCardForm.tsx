"use client";
import React, { useEffect, useCallback } from "react";
import { renderInput, renderMaskedInput } from "@/utils/formRenderers";
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

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

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
      {/* 卡號輸入框 */}
      {renderInput({
        type: "text",
        id: "card_number",
        name: "card_number",
        label: "信用卡卡號",
        placeholder: "請輸入16位數字",
        value: info.card_number,
        onChange: handleChange,
        maxLength: 16, // 限制長度為16
        error: errors.card_number,
        errorMessage: errorMessages.card_number,
        submitted,
      })}

      {/* 有效期限輸入框 */}
      {renderMaskedInput({
        mask: "99/99", // 掩碼格式
        id: "expiry_date",
        name: "expiry_date",
        label: "有效期限 (MM/YY)",
        placeholder: "請輸入(MM/YY)",
        value: info.expiry_date,
        onChange: handleChange,
        error: errors.expiry_date,
        errorMessage: errorMessages.expiry_date,
        submitted,
      })}

      {/* CVV輸入框 */}
      {renderInput({
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
      })}
    </>
  );
};

export default CreditCardForm;
