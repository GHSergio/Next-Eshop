import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { saveAddressThunk } from "@/store/slice/userSlice";
import { InsertAddressItem } from "@/types";
import { renderInput, renderSelect } from "@/utils/formRenderers";
import { updateDeliveryCity } from "@/store/slice/deliveryLocationSlice";
import { validateDeliveryInfo } from "@/utils/validators";

interface AddressModalProps {
  onOpen: boolean;
  onClose: () => void;
}
const AddressModal: React.FC<AddressModalProps> = React.memo(
  ({ onOpen, onClose }) => {
    const dispatch: AppDispatch = useDispatch();
    const deliveryLocation = useSelector(
      (state: RootState) => state.deliveryLocation
    );

    // 獲取當前用戶 ID
    const userData = localStorage.getItem("userData");
    const authId = userData ? JSON.parse(userData).id : null;

    // 表單狀態
    const [formData, setFormData] = useState<InsertAddressItem>({
      user_id: authId,
      recipient_name: "",
      phone: "",
      city: "",
      district: "",
      address_line: "",
      is_default: false,
    });

    // 錯誤和驗證狀態
    const [errors, setErrors] = useState({
      recipient_name: false,
      phone: false,
      city: false,
      district: false,
      address_line: false,
    });
    const [isFormValid, setIsFormValid] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // 驗證 StoreInfo 是否通過
    const validateForm = useCallback(() => {
      const newErrors = validateDeliveryInfo(formData);

      // 僅當錯誤狀態改變(單項符合驗證)時才執行
      if (JSON.stringify(errors) !== JSON.stringify(newErrors)) {
        // console.log("比較差異:", "store:", errors, "newErrors:", newErrors);
        setErrors(newErrors);
      }

      const isValid = !Object.values(newErrors).some((error) => error);
      setIsFormValid(isValid);
    }, [formData, errors, setErrors]);

    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const updatedInfo = { ...formData, [name]: value };
        setFormData(updatedInfo);

        // 即時驗證並更新狀態
        const newErrors = validateDeliveryInfo(updatedInfo);
        const isValid = !Object.values(newErrors).some((error) => error);
        setErrors(newErrors);
        setIsFormValid(isValid); // 即時更新 valid 狀態
      },
      [formData, setErrors]
    );

    const handleSelectChange = useCallback(
      (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = event.target;
        let updatedInfo = { ...formData };

        // 更新不同的 state 依據 name 的值
        if (name === "city") {
          // 當選擇城市時 通知 storeLocationSlice 更新地區列表
          dispatch(updateDeliveryCity(value));
          // 更新 state 的 city 部分 & 清空 district
          updatedInfo = { ...formData, city: value, district: "" };
        } else if (name === "district") {
          // 更新 state 的 district 部分
          updatedInfo = { ...formData, district: value };
        }

        // 更新 Redux 的 deliveryInfo
        setFormData(updatedInfo);

        // 即時驗證並更新狀態
        const newErrors = validateDeliveryInfo(updatedInfo);
        const isValid = !Object.values(newErrors).some((error) => error);
        setErrors(newErrors);
        setIsFormValid(isValid); // 即時更新 valid 狀態
      },
      [formData, dispatch, setErrors]
    );

    // 自定義 錯誤提示訊息
    const errorMessages: { [key: string]: string } = {
      recipient_name: "不能為空 & 特殊字符",
      phone: "請輸入有效的10位手機號碼",
      city: "請選擇縣市",
      district: "請選擇地區",
      address_line: "最少輸入5個字",
    };

    // 提交時觸發驗證
    useEffect(() => {
      if (submitted) validateForm();
    }, [submitted, validateForm]);

    // Modal
    const handleSaveClick = () => {
      setSubmitted(true);
      if (!isFormValid) return;
      dispatch(saveAddressThunk(formData));
      resetModal();
    };

    const handleCancelClick = () => {
      resetModal();
    };

    const resetModal = () => {
      setFormData({
        user_id: authId,
        recipient_name: "",
        phone: "",
        city: "",
        district: "",
        address_line: "",
        is_default: false,
      });
      setSubmitted(false);
      onClose();
    };

    return onOpen ? (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
        <div className="bg-[#1D8085] xs:w-95 sm:w-full max-w-md sm:max-w-lg max-h-[80vh] p-4 rounded shadow overflow-y-auto text-sm sm:text-base">
          <h2 className="text-lg font-semibold mb-4">新增收貨地址</h2>

          {/* Input */}
          {renderInput({
            type: "text",
            id: "recipient_name",
            name: "recipient_name",
            label: "姓名",
            placeholder: "請輸入取件人姓名",
            value: formData.recipient_name,
            onChange: handleInputChange,
            maxLength: 50,
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
            value: formData.phone,
            onChange: handleInputChange,
            maxLength: 10,
            error: errors.phone,
            errorMessage: errorMessages.phone,
            submitted,
          })}

          {renderSelect({
            id: "city",
            name: "city",
            label: "縣市",
            value: formData.city,
            options: deliveryLocation.cities,
            onChange: handleSelectChange,
            error: errors.city,
            submitted,
          })}
          {renderSelect({
            id: "district",
            name: "district",
            label: "地區",
            value: formData.district,
            options: deliveryLocation.districts,
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
            value: formData.address_line,
            onChange: handleInputChange,
            minLength: 15,
            maxLength: 100,
            error: errors.address_line,
            errorMessage: errorMessages.address_line,
            submitted,
          })}

          <div className="flex justify-between mt-4">
            <button
              className="bg-gray-300 px-4 py-2 rounded"
              onClick={handleCancelClick}
            >
              取消
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleSaveClick}
            >
              新增
            </button>
          </div>
        </div>
      </div>
    ) : null;
  }
);

// 添加 `displayName`
AddressModal.displayName = "AddressModal";

export default AddressModal;
