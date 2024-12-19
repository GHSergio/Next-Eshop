import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { saveStoreThunk, fetchStoresThunk } from "@/store/slice/userSlice";
import {
  updateStoreCities,
  updateStoreDistricts,
  updateStoreRoadSections,
  updateStores,
} from "@/store/slice/storeLocationSlice";
import { InsertStoreItem, StoreErrors } from "@/types";
import { renderInput, renderSelect } from "@/utils/formRenderers";
import { validateStoreInfo } from "@/utils/validators";

interface StoreModalProps {
  onOpen: boolean;
  onClose: () => void;
}

const StoreModal: React.FC<StoreModalProps> = ({ onOpen, onClose }) => {
  const dispatch: AppDispatch = useDispatch();
  const store = useSelector((state: RootState) => state.storeLocation);
  // 獲取當前用戶 ID
  const userData = localStorage.getItem("userData");
  const authId = userData ? JSON.parse(userData).id : null;

  // 初始表單狀態
  const [formData, setFormData] = useState<InsertStoreItem>({
    user_id: authId, // 可從 localStorage 獲取
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

  const [errors, setErrors] = useState<StoreErrors>({
    recipient_name: false,
    phone: false,
    c_store: false,
    city: false,
    district: false,
    road_section: false,
    store_name: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  // 驗證 StoreInfo 是否通過
  const validateForm = useCallback(() => {
    const newErrors = validateStoreInfo(formData);

    // 僅當錯誤狀態改變(單項符合驗證)時才執行
    if (JSON.stringify(errors) !== JSON.stringify(newErrors)) {
      // console.log("比較差異:", "store:", errors, "newErrors:", newErrors);
      setErrors(newErrors);
    }

    const isValid = !Object.values(newErrors).some((error) => error);
    setIsFormValid(isValid);
  }, [formData, errors, setErrors]);

  // 提交時觸發驗證
  useEffect(() => {
    if (submitted) validateForm();
  }, [submitted, validateForm]);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      const updatedInfo = { ...formData, [name]: value };
      setFormData(updatedInfo);
      // 即時驗證並更新狀態
      const newErrors = validateStoreInfo(updatedInfo);
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

      if (name === "c_store") {
        // 通知 storeLocationSlice 更新city列表
        dispatch(updateStoreCities(value));
        // 更新 state 的 city 部分 & 清空 city以下項目
        updatedInfo = {
          ...formData,
          c_store: value,
          city: "",
          district: "",
          road_section: "",
          store_name: "",
          store_address: "",
        };
      } else if (name === "city") {
        dispatch(updateStoreDistricts(value));
        updatedInfo = {
          ...formData,
          city: value,
          district: "",
          road_section: "",
          store_name: "",
          store_address: "",
        };
      } else if (name === "district") {
        dispatch(updateStoreRoadSections(value));
        updatedInfo = {
          ...formData,
          district: value,
          road_section: "",
          store_name: "",
          store_address: "",
        };
      } else if (name === "road_section") {
        dispatch(updateStores(value));
        updatedInfo = {
          ...formData,
          road_section: value,
          store_name: "",
          store_address: "",
        };
      } else if (name === "store") {
        const selectedStore = store.stores.find(
          (store) => store.store_name === value
        );
        if (selectedStore) {
          updatedInfo = {
            ...formData,
            store_name: selectedStore.store_name,
            store_address: selectedStore.store_address,
          };
        }
      }
      // 更新 Redux 的 deliveryInfo
      setFormData(updatedInfo);

      // 即時驗證並更新狀態
      const newErrors = validateStoreInfo(updatedInfo);
      const isValid = !Object.values(newErrors).some((error) => error);
      setErrors(newErrors);
      setIsFormValid(isValid); // 即時更新 valid 狀態
    },
    [dispatch, formData, store.stores, setErrors]
  );

  // 自定義 錯誤提示訊息
  const errorMessages: { [key: string]: string } = {
    recipient_name: "不能為空&特殊字符",
    phone: "請輸入有效的10位手機號碼",
    c_store: "請選擇超商類型",
    city: "請選擇縣市",
    district: "請選擇地區",
    road_section: "請選擇路段",
    store: "請選擇門市",
  };

  const handleSave = async () => {
    setSubmitted(true);
    if (!isFormValid) return;

    try {
      await dispatch(saveStoreThunk(formData)).unwrap();
      // 保存成功後重新 fetch stores
      dispatch(fetchStoresThunk(authId));
      resetModal(); // 清空表單並關閉 Modal
    } catch (error) {
      console.error("保存失敗:", error);
    }
  };

  const handleCancel = () => {
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
    onClose();
  };

  return onOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center backdrop-blur-sm">
      <div className="bg-[#25A0A7] p-4 rounded shadow w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">新增取貨門市</h2>

        {/* Input */}
        {renderInput({
          type: "text",
          id: "recipient_name",
          name: "recipient_name",
          label: "姓名",
          placeholder: "請輸入取件人姓名",
          value: formData.recipient_name,
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
          value: formData.phone,
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
          value: formData.c_store,
          options: store.cStores,
          onChange: handleSelectChange,
          error: errors.c_store,
          submitted,
        })}
        {renderSelect({
          id: "city",
          name: "city",
          label: "縣市",
          value: formData.city,
          options: store.cities,
          onChange: handleSelectChange,
          error: errors.city,
          submitted,
        })}
        {renderSelect({
          id: "district",
          name: "district",
          label: "地區",
          value: formData.district,
          options: store.districts,
          onChange: handleSelectChange,
          error: errors.district,
          submitted,
        })}
        {renderSelect({
          id: "road_section",
          name: "road_section",
          label: "路段",
          value: formData.road_section,
          options: store.roadSections,
          onChange: handleSelectChange,
          error: errors.road_section,
          submitted,
        })}
        {renderSelect({
          id: "store",
          name: "store",
          label: "門市",
          value: formData.store_name,
          options: store.stores.map((store) => store.store_name), // 只傳入 store_name
          // options: store.stores.map(
          //   (store) => `${store.store_name}-${store.store_address}`
          // ), // 提取 store_name 列表
          onChange: handleSelectChange,
          error: errors.store_name,
          submitted,
        })}

        <div className="flex justify-between mt-4">
          <button
            className="bg-gray-300 px-4 py-2 rounded"
            onClick={handleCancel}
          >
            取消
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleSave}
          >
            新增
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default StoreModal;
