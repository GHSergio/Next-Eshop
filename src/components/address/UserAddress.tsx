"use client";
import React, { useState } from "react";
import { AddressItem } from "@/types";
import AddressModal from "@/components/address/AddressModal"; // 引入新增門市的 Modal
import AddressComponent from "./AddressComponent";

interface UserAddressProps {
  addresses: AddressItem[]; // 所有的門市資料
  currentAddressId: string | null; // 當前選中的門市 ID
  onSelectAddress: (address: AddressItem) => void; // 選擇門市後的回調函數
  onClose: () => void; // 關閉 Modal 的回調函數
  isAddressModalOpen: boolean;
}

const UserStore: React.FC<UserAddressProps> = ({
  addresses,
  // currentAddressId,
  onSelectAddress,
  onClose,
  isAddressModalOpen,
}) => {
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);

  // 過濾出目前選中門市以外的其他門市資料
  // const filteredAddresses = addresses.filter(
  //   (address) => address.id !== currentAddressId
  // );

  const handleOpenAddAddressModal = () => {
    setIsAddAddressModalOpen(true);
  };

  const handleCloseAddAddressModal = () => {
    setIsAddAddressModalOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      {/* Modal Container */}
      <div className="bg-[#25A0A7] p-6 rounded-lg shadow-lg w-full max-w-3xl relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">選擇其他地址</h2>
          <button
            onClick={handleOpenAddAddressModal}
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
          >
            新增
          </button>
        </div>

        {/* 門市清單 */}
        <div className="bg-[#25A0A7] xs:max-h-80 overflow-y-auto rounded-md shadow-inner">
          {addresses.length === 0 ? (
            <h2 className="text-center text-xl font-semibold my-2">
              請新增地址
            </h2>
          ) : (
            <div className="xs:max-h-70 space-y-2 p-3 border-2 border-gray-300 rounded-md cursor-pointer overflow-y-auto">
              {addresses.map((address) => (
                <AddressComponent
                  key={address.id}
                  address={address}
                  onSelect={() => onSelectAddress(address)}
                  isAddressModalOpen={isAddressModalOpen}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
          >
            關閉
          </button>
        </div>

        {/* StoreModal for Adding New Store */}
        {isAddAddressModalOpen && (
          <AddressModal
            onOpen={isAddAddressModalOpen}
            onClose={handleCloseAddAddressModal}
          />
        )}
      </div>
    </div>
  );
};

export default UserStore;
