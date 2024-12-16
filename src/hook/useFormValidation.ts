// src/hooks/useFormValidation.ts
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { setErrors } from "@/store/slice/userSlice";
import {
  validateDeliveryInfo,
  validateStoreInfo,
  validateCreditCardInfo,
} from "@/utils/validators";

export const useFormValidation = () => {
  const dispatch = useDispatch();

  const validateForm = useCallback(
    (
      type: "delivery" | "store" | "credit",
      formData: any,
      currentErrors: any
    ): boolean => {
      let validationResult = {};
      if (type === "delivery") {
        validationResult = validateDeliveryInfo(formData);
      } else if (type === "store") {
        validationResult = validateStoreInfo(formData);
      } else if (type === "credit") {
        validationResult = validateCreditCardInfo(formData);
      }

      const isValid = !Object.values(validationResult).some((error) => error);
      dispatch(setErrors({ ...currentErrors, [type]: validationResult }));

      return isValid;
    },
    [dispatch]
  );

  return validateForm;
};
