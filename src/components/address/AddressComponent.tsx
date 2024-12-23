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

  const textStyle = "font-bold xs:text-[0.9rem] sm:text-[1rem]";
  return (
    <div
      key={id}
      className={`border p-4 rounded shadow flex justify-between items-start ${
        isAddressModalOpen ? "cursor-pointer hover:bg-green-600" : ""
      }`}
      onClick={onSelect}
    >
      <div>
        <p className={textStyle}>
          收件人：
          {recipient_name}
        </p>
        <p className={textStyle}>
          聯絡手機：
          {phone}
        </p>
        <p className={textStyle}>
          收貨地址：
          {city} {district} {address_line}
        </p>
      </div>

      {/* 只有當 isDeletable 為 true 時顯示刪除按鈕 */}
      {isDeletable && onDelete && (
        <button
          onClick={() => onDelete(address.id)}
          className="xs:max-w-[70] xs:min-w-[65] xs:text-[0.8rem]sm:max-w-[80] sm:min-w-[70] sm:text-[1rem] font-semibold px-2 py-1"
        >
          刪除
        </button>
      )}
    </div>
  );
};

export default AddressComponent;
