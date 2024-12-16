import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  saveAddressThunk,
  setIsAddAddressModalOpen,
} from "@/store/slice/userSlice";
import DeliveryForm from "@/components/cartStep/DeliveryForm";
import { InsertAddressItem } from "@/types";
const AddressModal = () => {
  const dispatch: AppDispatch = useDispatch();
  const isAddAddressModalOpen = useSelector(
    (state: RootState) => state.user.isAddAddressModalOpen
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
    dispatch(setIsAddAddressModalOpen(false));
  };

  // console.log("Modal Open:", isAddAddressModalOpen);

  return isAddAddressModalOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center backdrop-blur-sm">
      <div className="bg-[#25A0A7] p-4 rounded shadow w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">新增收貨地址</h2>
        <DeliveryForm
          user_id={authId}
          Info={formData}
          setInfo={(info) => setFormData(info)}
          errors={errors}
          setErrors={(error) => setErrors(error)}
          onValidate={setIsFormValid}
          submitted={submitted}
        />

        <div className="flex justify-between mt-4">
          <button
            className="bg-gray-300 px-4 py-2 rounded"
            onClick={handleCancelClick}
          >
            取消
          </button>
          <button
            className={`px-4 py-2 rounded ${
              isFormValid
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-500 cursor-pointer"
            }`}
            onClick={handleSaveClick}
          >
            新增
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default AddressModal;
