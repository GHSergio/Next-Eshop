"use client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  setIsAddAddressModalOpen,
  setIsAddStoreModalOpen,
  deleteAddressThunk,
  deleteStoreThunk,
} from "@/store/slice/userSlice";
import AddressModal from "@/components/members/AddressModal";
import StoreModal from "@/components/members/StoreModal";

const MyAddresses: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const addresses = useSelector((state: RootState) => state.user.addresses);
  const stores = useSelector((state: RootState) => state.user.stores);

  // 新增
  const handleAddAddress = () => {
    dispatch(setIsAddAddressModalOpen(true));
  };

  const handleAddStore = () => {
    dispatch(setIsAddStoreModalOpen(true));
  };

  // 移除
  const handleDeleteAddress = (addressId: string) => {
    if (confirm("確認刪除此地址？")) {
      dispatch(deleteAddressThunk(addressId));
    }
  };

  const handleDeleteStore = (storeId: string) => {
    if (confirm("確認刪除此門市？")) {
      dispatch(deleteStoreThunk(storeId));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* <h1 className="text-2xl font-bold mb-4">我的地址與門市</h1> */}
      {/* header 按鈕 */}
      <div className="flex justify-between mb-6">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleAddAddress}
        >
          新增收貨地址
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleAddStore}
        >
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
              <div
                key={address.id}
                className="border p-4 rounded shadow flex justify-between items-start"
              >
                <div>
                  <p>
                    <strong>收件人：</strong>
                    {address.recipient_name}
                  </p>
                  <p>
                    <strong>聯絡手機：</strong>
                    {address.phone}
                  </p>
                  <p>
                    <strong>收貨地址：</strong>
                    {address.city} {address.district} {address.address_line}
                  </p>
                </div>
                <button
                  className="text-blue-500 underline"
                  onClick={() => handleDeleteAddress(address.id)}
                >
                  刪除
                </button>
              </div>
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
              <div
                key={store.id}
                className="border p-4 rounded shadow flex justify-between items-start"
              >
                <div>
                  <p>
                    <strong>
                      {store.c_store} : {store.store_name}
                    </strong>
                  </p>
                  <p>
                    <strong>取貨人：</strong>
                    {store.recipient_name}
                  </p>
                  <p>
                    <strong>聯絡手機：</strong>
                    {store.phone}
                  </p>
                  <p>
                    <strong>門市地址：</strong>
                    {store.city} {store.district} {store.store_address}
                  </p>
                </div>
                <button
                  className="text-blue-500 underline"
                  onClick={() => handleDeleteStore(store.id)}
                >
                  刪除
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddressModal />
      <StoreModal />
    </div>
  );
};

export default MyAddresses;
