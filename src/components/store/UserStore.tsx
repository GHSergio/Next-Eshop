"use client";
import React, { useState } from "react";
import { StoreItem } from "@/types";
import StoreModal from "@/components/store/StoreModal"; // 引入新增門市的 Modal
import StoreComponent from "./StoreComponent";

interface UserStoreProps {
  stores: StoreItem[]; // 所有的門市資料
  currentStoreId: string | null; // 當前選中的門市 ID
  onSelectStore: (store: StoreItem) => void; // 選擇門市後的回調函數
  onClose: () => void; // 關閉 Modal 的回調函數
  isStoreModalOpen: boolean;
}

const UserStore: React.FC<UserStoreProps> = ({
  stores,
  // currentStoreId,
  onSelectStore,
  onClose,
  isStoreModalOpen,
}) => {
  const [isAddStoreModalOpen, setIsAddStoreModalOpen] = useState(false);

  // 過濾出目前選中門市以外的其他門市資料
  // const filteredStores = stores.filter((store) => store.id !== currentStoreId);

  const handleOpenAddStoreModal = () => {
    setIsAddStoreModalOpen(true);
  };

  const handleCloseAddStoreModal = () => {
    setIsAddStoreModalOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      {/* Modal Container */}
      <div className="bg-[#25A0A7] p-6 rounded-lg shadow-lg w-full max-w-3xl relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">選擇其他門市</h2>
          <button
            onClick={handleOpenAddStoreModal}
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
          >
            新增
          </button>
        </div>

        {/* 門市清單 */}
        <div className="bg-[#25A0A7] max-h-[500px] overflow-y-auto rounded-md shadow-inner">
          {stores.length === 0 ? (
            <h2 className="text-center text-xl font-semibold my-2">
              請新增門市
            </h2>
          ) : (
            <div className="space-y-2 p-3 border-2 border-gray-300 rounded-md cursor-pointer">
              {stores.map((store) => (
                <StoreComponent
                  key={store.id}
                  store={store}
                  onSelect={() => onSelectStore(store)}
                  isStoreModalOpen={isStoreModalOpen}
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
        {isAddStoreModalOpen && (
          <StoreModal
            onOpen={isAddStoreModalOpen}
            onClose={handleCloseAddStoreModal}
          />
        )}
      </div>
    </div>
  );
};

export default UserStore;
