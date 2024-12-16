"use client";
import React, { useEffect, useCallback } from "react";
import { renderInput } from "@/utils/formRenderers";
import { validateCreditCardInfo } from "@/utils/validators";
import { CreditCardInfo, CreditCardErrors } from "@/types";
interface CreditCardFormProps {
  user_id?: string;
  Info: CreditCardInfo;
  setInfo: (info: CreditCardInfo) => void;
  errors: CreditCardErrors;
  setErrors: (errors: CreditCardErrors) => void;
  onValidate: (isValid: boolean) => void;
  submitted: boolean;
}

const CreditCardForm: React.FC<CreditCardFormProps> = ({
  Info,
  setInfo,
  errors,
  setErrors,
  onValidate,
  submitted,
}) => {
  // 驗證 creditCardInfo 是否通過
  const validateForm = useCallback(() => {
    const newErrors = validateCreditCardInfo(Info);

    // 僅當錯誤狀態改變(單項符合驗證)時才執行
    if (JSON.stringify(errors) !== JSON.stringify(newErrors)) {
      console.log("比較差異:", "creditCard:", errors, "newErrors:", newErrors);
      setErrors(newErrors);
    }

    const isValid = !Object.values(newErrors).some((error) => error);
    onValidate(isValid);
  }, [Info, errors, setErrors, onValidate]);

  // 提交時觸發驗證
  useEffect(() => {
    if (submitted) validateForm();
  }, [submitted, validateForm]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      const updateInfo = { ...Info, [name]: value };
      // 將target value set 到 creditCardInfo state
      setInfo(updateInfo);

      // 即時驗證並更新狀態
      const newErrors = validateCreditCardInfo(updateInfo);
      const isValid = !Object.values(newErrors).some((error) => error);
      setErrors(newErrors);
      onValidate(isValid); // 即時更新 valid 狀態
    },
    [Info, onValidate, setErrors, setInfo]
  );

  const errorMessages: { [key: string]: string } = {
    card_number: "請輸入信用卡卡號",
    expiry_date: "請輸入有限期限",
    cvv: "請輸入背面末三碼",
  };

  return (
    <>
      {/* 卡號輸入框 */}
      {renderInput({
        type: "text",
        id: "card_number",
        name: "card_number",
        label: "信用卡卡號",
        placeholder: "請輸入信用卡卡號",
        value: Info.card_number,
        onChange: handleChange,
        error: errors.card_number,
        errorMessage: errorMessages.card_number,
        submitted,
      })}

      {/* 有效期限輸入框 */}
      {renderInput({
        type: "month",
        id: "expiry_date",
        name: "expiry_date",
        label: "有限期限",
        placeholder: "請輸入有限期限",
        value: Info.expiry_date,
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
        placeholder: "請輸入背面末三碼",
        value: Info.cvv,
        onChange: handleChange,
        error: errors.cvv,
        errorMessage: errorMessages.cvv,
        submitted,
      })}
    </>
  );
};

export default CreditCardForm;
