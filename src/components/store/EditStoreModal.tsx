"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { StoreInfo, StoreErrors } from "@/types";
import { renderInput, renderSelect } from "@/utils/formRenderers";
import { validateStoreInfo } from "@/utils/validators";
import StoreModal from "@/components/store/StoreModal";

interface ConvenienceStoreFormProps {
  user_id?: string;
  info: StoreInfo;
  setInfo: (info: StoreInfo) => void;
  errors: StoreErrors;
  setErrors: (errors: StoreErrors) => void;
  onValidate: (isValid: boolean) => void;
  submitted: boolean;
}

const ConvenienceStoreForm: React.FC<ConvenienceStoreFormProps> = ({
  info,
  setInfo,
  // errors,
  // setErrors,
  // onValidate,
  // submitted,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const stores = useSelector((state: RootState) => state.user.stores);
  const store_info = useSelector((state: RooteState) => state.user.store_info);

  useEffect(() => {
    if (stores.length > 0) {
      const firstStore = stores[0]; // 取得第一筆 store
      setInfo({
        user_id: info.user_id || "", // 保留 user_id
        recipient_name: firstStore.recipient_name || "",
        phone: firstStore.phone || "",
        c_store: firstStore.c_store || "",
        city: firstStore.city || "",
        district: firstStore.district || "",
        road_section: firstStore.road_section || "",
        store_name: firstStore.store_name || "",
        store_address: firstStore.store_address || "",
        is_default: false, // 預設值
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stores]);

  // // 驗證 StoreInfo 是否通過
  // const validateForm = useCallback(() => {
  //   const newErrors = validateStoreInfo(info);

  //   // 僅當錯誤狀態改變(單項符合驗證)時才執行
  //   if (JSON.stringify(errors) !== JSON.stringify(newErrors)) {
  //     console.log("比較差異:", "store:", errors, "newErrors:", newErrors);
  //     // setErrors({ ...errors, store: newErrors });
  //     setErrors(newErrors);
  //   }

  //   const isValid = !Object.values(newErrors).some((error) => error);
  //   onValidate(isValid);
  // }, [info, errors, onValidate, setErrors]);

  // // 提交時觸發驗證
  // useEffect(() => {
  //   if (submitted) validateForm();
  // }, [submitted, validateForm]);

  // const handleInputChange = useCallback(
  //   (event: React.ChangeEvent<HTMLInputElement>) => {
  //     const { name, value } = event.target;
  //     const updatedInfo = { ...info, [name]: value };
  //     setInfo(updatedInfo);
  //     // 即時驗證並更新狀態
  //     const newErrors = validateStoreInfo(updatedInfo);
  //     const isValid = !Object.values(newErrors).some((error) => error);
  //     setErrors(newErrors);
  //     onValidate(isValid); // 即時更新 valid 狀態
  //   },
  //   [info, setErrors, setInfo, onValidate]
  // );
  // const handleSelectChange = useCallback(
  //   (event: React.ChangeEvent<HTMLSelectElement>) => {
  //     const { name, value } = event.target;
  //     let updatedInfo = { ...info };

  //     if (name === "store") {
  //       const selectedStore = stores.find(
  //         (store) => store.store_name === value
  //       );

  //       if (selectedStore) {
  //         updatedInfo = {
  //           ...info,
  //           store_name: selectedStore.store_name,
  //           store_address: selectedStore.store_address,
  //         };
  //       }
  //     }
  //     setInfo(updatedInfo);

  //     // 即時驗證並更新狀態
  //     const newErrors = validateStoreInfo(updatedInfo);
  //     const isValid = !Object.values(newErrors).some((error) => error);
  //     setErrors(newErrors);
  //     onValidate(isValid); // 即時更新 valid 狀態
  //   },
  //   [info, setInfo, stores, setErrors, onValidate]
  // );

  // // 自定義 錯誤提示訊息
  // const errorMessages: { [key: string]: string } = {
  //   recipient_name: "姓名不能為空",
  //   phone: "請輸入有效的10位手機號碼",
  //   store: "請選擇門市",
  // };

  const handleOpenStoreModal = () => {
    setIsStoreModalOpen(true);
  };

  const handleCloseStoreModal = () => {
    setIsStoreModalOpen(false);
  };

  console.log(stores);
  console.log(store_info);

  return (
    <>
      {/* Input */}
      {/* {renderInput({
        type: "text",
        id: "recipient_name",
        name: "recipient_name",
        label: "姓名",
        placeholder: "請輸入取件人姓名",
        value: info.recipient_name,
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
        value: info.phone,
        onChange: handleInputChange,
        error: errors.phone,
        errorMessage: errorMessages.phone,
        submitted,
      })} */}

      {/* Select 常用的門市 */}
      {/* {renderSelect({
        id: "store",
        name: "store",
        label: "常用門市",
        value: info.store_name,
        // options: stores, // 傳入 object[]
        options: stores.map((store) => store.store_name),
        // options: stores.map(
        //   (store) => `${store.store_name} - ${store.store_address}`
        // ),
        onChange: handleSelectChange,
        error: errors.store_name,
        submitted,
      })} */}
      <div className="space-y-4">
        <div
          // key={store.id}
          className="border p-4 rounded shadow flex justify-between items-start"
        >
          <div>
            <p>
              <strong>
                {info.c_store} : {info.store_name}
              </strong>
            </p>
            <p>
              <strong>取貨人：</strong>
              {info.recipient_name}
            </p>
            <p>
              <strong>聯絡手機：</strong>
              {info.phone}
            </p>
            <p>
              <strong>門市地址：</strong>
              {info.city} {info.district} {info.store_address}
            </p>
          </div>
          {/* <button
              className="text-blue-500 underline"
              onClick={() => handleDeleteStore(store.id)}
            >
              刪除
            </button> */}
        </div>
        {/* 選擇其他門市 */}
        <button
          type="button"
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
          onClick={handleOpenStoreModal}
        >
          選擇門市
        </button>
      </div>

      {/* 選擇其他門市 */}
      {/* <button
        type="button"
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={handleOpenStoreModal}
      >
        選擇門市
      </button> */}

      {/* StoreModal */}
      <StoreModal onOpen={isStoreModalOpen} onClose={handleCloseStoreModal} />
    </>
  );
};

export default ConvenienceStoreForm;
