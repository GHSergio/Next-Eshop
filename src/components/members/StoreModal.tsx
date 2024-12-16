import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  saveStoreThunk,
  setIsAddStoreModalOpen,
} from "@/store/slice/userSlice";
import ConvenienceStoreForm from "@/components/cartStep/ConvenienceStoreForm";
import { InsertStoreItem } from "@/types";

const StoreModal = () => {
  const dispatch: AppDispatch = useDispatch();
  const isStoreModalOpen = useSelector(
    (state: RootState) => state.user.isAddStoreModalOpen
  );

  // 獲取當前用戶 ID
  const userData = localStorage.getItem("userData");
  const authId = userData ? JSON.parse(userData).id : null;

  // 表單狀態
  const [formData, setFormData] = useState<InsertStoreItem>({
    user_id: authId,
    recipient_name: "",
    phone: "",
    c_store: "",
    city: "",
    district: "",
    road_section: "",
    store_name: "",
    store_address: "",
    is_default: false,
  });

  // 錯誤和驗證狀態
  const [errors, setErrors] = useState({
    recipient_name: false,
    phone: false,
    c_store: false,
    city: false,
    district: false,
    road_section: false,
    store_name: false,
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSaveClick = () => {
    setSubmitted(true);
    if (!isFormValid) return;
    dispatch(saveStoreThunk(formData));
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
      c_store: "",
      city: "",
      district: "",
      road_section: "",
      store_name: "",
      store_address: "",
      is_default: false,
    });
    setSubmitted(false);
    dispatch(setIsAddStoreModalOpen(false));
  };

  return isStoreModalOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center backdrop-blur-sm">
      <div className="bg-[#25A0A7] p-4 rounded shadow w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">新增取貨門市</h2>

        <ConvenienceStoreForm
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
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleSaveClick}
          >
            新增
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default StoreModal;
