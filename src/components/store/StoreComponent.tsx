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
  return (
    <div
      key={id}
      className={`border p-4 rounded shadow flex justify-between items-start ${
        isStoreModalOpen ? "cursor-pointer hover:bg-green-600" : ""
      }`}
      onClick={onSelect}
    >
      <div>
        <p>
          <strong>
            {c_store} : {store_name}
          </strong>
        </p>
        <p>
          <strong>取貨人：</strong>
          {recipient_name}
        </p>
        <p>
          <strong>聯絡手機：</strong>
          {phone}
        </p>
        <p>
          <strong>門市地址：</strong>
          {city} {district} {store_address}
        </p>
      </div>

      {/* 只有當 isDeletable 為 true 時顯示刪除按鈕 */}
      {isDeletable && onDelete && (
        <button
          onClick={() => onDelete(store.id)}
          className="mt-2 px-2 py-1 text-black-500"
        >
          刪除
        </button>
      )}
    </div>
  );
};

export default StoreComponent;
