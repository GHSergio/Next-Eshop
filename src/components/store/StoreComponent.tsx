import React from "react";
import { StoreItem } from "@/types";

interface StoreItemProps {
  store: StoreItem;
  onDelete?: (id: string) => void;
  onSelect?: () => void;
  isStoreModalOpen?: boolean;
  isDeletable?: boolean;
}

const StoreComponent: React.FC<StoreItemProps> = ({
  store,
  onDelete,
  onSelect,
  isStoreModalOpen,
  isDeletable = false,
}) => {
  const {
    id,
    recipient_name,
    phone,
    c_store,
    city,
    district,
    store_name,
    store_address,
  } = store;

  const textStyle = "font-bold xs:text-[0.9rem] sm:text-[1rem]";

  return (
    <div
      key={id}
      className={`border p-4 rounded shadow flex justify-between items-start ${
        isStoreModalOpen ? "cursor-pointer hover:bg-green-600" : ""
      }`}
      onClick={onSelect}
    >
      <div>
        <p className={textStyle}>
          {c_store} : {store_name}
        </p>
        <p className={textStyle}>
          取貨人：
          {recipient_name}
        </p>
        <p className={textStyle}>
          聯絡手機：
          {phone}
        </p>
        <p className={textStyle}>
          門市地址：
          {city} {district} {store_address}
        </p>
      </div>

      {/* 只有當 isDeletable 為 true 時顯示刪除按鈕 */}
      {isDeletable && onDelete && (
        <button
          onClick={() => onDelete(store.id)}
          className="xs:max-w-[70] xs:min-w-[65] xs:text-[0.8rem]sm:max-w-[80] sm:min-w-[70] sm:text-[1rem] font-semibold px-2 py-1"
        >
          刪除
        </button>
      )}
    </div>
  );
};

export default StoreComponent;
