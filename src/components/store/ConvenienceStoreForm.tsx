"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { StoreErrors, StoreItem } from "@/types";
import StoreComponent from "./StoreComponent";
import UserStore from "./UserStore";

interface ConvenienceStoreFormProps {
  user_id?: string;
  info: StoreItem;
  setInfo: (info: StoreItem) => void;
  errors: StoreErrors;
  setErrors: (errors: StoreErrors) => void;
  onValidate: (isValid: boolean) => void;
  // submitted?: boolean;
}

const ConvenienceStoreForm: React.FC<ConvenienceStoreFormProps> = ({
  info,
  setInfo,
}) => {
  // const dispatch: AppDispatch = useDispatch();
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const stores = useSelector((state: RootState) => state.user.stores);
  const store_info = useSelector((state: RootState) => state.user.store_info);

  useEffect(() => {
    if (stores.length > 0) {
      const firstStore = stores[0]; // 取得第一筆 store
      setInfo({
        id: info.id,
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

  const handleOpenStoreModal = () => {
    setIsStoreModalOpen(true);
  };

  console.log(stores);
  console.log(store_info);

  return (
    <>
      <div className="space-y-4">
        <StoreComponent store={info} />

        <button
          type="button"
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
          onClick={handleOpenStoreModal}
        >
          選擇門市
        </button>
      </div>

      {/* UserStore Modal */}

      {isStoreModalOpen && (
        <UserStore
          stores={stores}
          currentStoreId={info.id}
          onSelectStore={(store) => {
            setInfo({
              ...info,
              ...store, // 更新選中的門市資訊
            });
            setIsStoreModalOpen(false);
          }}
          onClose={() => setIsStoreModalOpen(false)}
          isStoreModalOpen={isStoreModalOpen}
        />
      )}
    </>
  );
};

export default ConvenienceStoreForm;
