import React from "react";
import { AddressItem } from "@/types";

interface AddressComponentProps {
  address: AddressItem;
  onDelete?: (id: string) => void;
  onSelect?: () => void;
  isAddressModalOpen?: boolean;
  isDeletable?: boolean;
}

const AddressComponent: React.FC<AddressComponentProps> = ({
  address,
  onDelete,
  onSelect,
  isAddressModalOpen,
  isDeletable = false,
}) => {
  const { id, recipient_name, phone, city, district, address_line } = address;
  return (
    <div
      key={id}
      className={`border p-4 rounded shadow flex justify-between items-start ${
        isAddressModalOpen ? "cursor-pointer hover:bg-green-600" : ""
      }`}
      onClick={onSelect}
    >
      <div>
        <p>
          <strong>收件人：</strong>
          {recipient_name}
        </p>
        <p>
          <strong>聯絡手機：</strong>
          {phone}
        </p>
        <p>
          <strong>收貨地址：</strong>
          {city} {district} {address_line}
        </p>
      </div>

      {/* 只有當 isDeletable 為 true 時顯示刪除按鈕 */}
      {isDeletable && onDelete && (
        <button
          onClick={() => onDelete(address.id)}
          className="mt-2 px-2 py-1 text-black-500"
        >
          刪除
        </button>
      )}
    </div>
  );
};

export default AddressComponent;
