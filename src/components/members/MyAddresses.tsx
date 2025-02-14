"use client";
import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { deleteAddressThunk, deleteStoreThunk } from "@/store/slice/userSlice";
import AddressModal from "@/components/address/AddressModal";
import StoreModal from "@/components/store/StoreModal";
import StoreComponent from "@/components/store/StoreComponent";
import AddressComponent from "@/components/address/AddressComponent";

const MyAddresses: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const addresses = useSelector((state: RootState) => state.user.addresses);
  const stores = useSelector((state: RootState) => state.user.stores);
  // 新增 Modal 控制
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);

  // 開啟 Addres Modal
  const handleOpenAddressModal = useCallback(() => {
    setIsAddressModalOpen(true);
  }, []);

  // 關閉 Addres Modal
  const handleCloseAddressModal = useCallback(() => {
    setIsAddressModalOpen(false);
  }, []);

  // 開啟 Store Modal
  const handleOpenStoreModal = useCallback(() => {
    setIsStoreModalOpen(true);
  }, []);

  // 關閉 Addres Modal
  const handleCloseStoreModal = useCallback(() => {
    setIsStoreModalOpen(false);
  }, []);

  // 刪除地址
  const handleDeleteAddress = useCallback(
    async (addressId: string) => {
      if (confirm("確認刪除此地址？")) {
        await dispatch(deleteAddressThunk(addressId));
      }
    },
    [dispatch]
  );

  // 刪除門市
  const handleDeleteStore = useCallback(
    (storeId: string) => {
      if (confirm("確認刪除此門市？")) {
        dispatch(deleteStoreThunk(storeId));
      }
    },
    [dispatch]
  );

  const addButtonStyle =
    "bg-blue-500 text-white font-semibold px-4 py-2 rounded xs:text-[0.8rem] sm:text-[1.2rem]";

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* header 按鈕 */}
      <div className="flex justify-between mb-6">
        <button
          className={`${addButtonStyle} mr-1`}
          onClick={handleOpenAddressModal}
        >
          新增收貨地址
        </button>
        <button className={addButtonStyle} onClick={handleOpenStoreModal}>
          新增取貨門市
        </button>
      </div>
      {/* 收件地址 */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">收貨地址</h2>
        {addresses.length === 0 ? (
          <p>尚未新增任何收件地址</p>
        ) : (
          <div className="space-y-4">
            {addresses.map((address) => (
              <AddressComponent
                key={address.id}
                address={address}
                onDelete={handleDeleteAddress}
                isDeletable={true}
              />
            ))}
          </div>
        )}
      </div>

      {/* 取貨門市 */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">取貨門市</h2>
        {stores.length === 0 ? (
          <p>尚未新增任何取貨門市</p>
        ) : (
          <div className="space-y-4">
            {stores.map((store) => (
              <StoreComponent
                key={store.id}
                store={store}
                onDelete={handleDeleteStore}
                isDeletable={true}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddressModal
        onOpen={isAddressModalOpen}
        onClose={handleCloseAddressModal}
      />

      <StoreModal onOpen={isStoreModalOpen} onClose={handleCloseStoreModal} />
    </div>
  );
};

export default MyAddresses;
