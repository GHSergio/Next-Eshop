"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { AddressItem, DeliveryErrors } from "@/types";
import AddressComponent from "./AddressComponent";
import UserAddress from "@/components/address/UserAddress";

interface DeliveryFormProps {
  user_id?: string;
  info: AddressItem;
  setInfo: (info: AddressItem) => void;
  errors: DeliveryErrors;
  setErrors: (errors: DeliveryErrors) => void;
  onValidate: (isValid: boolean) => void;
  submitted: boolean;
}

const DeliveryForm: React.FC<DeliveryFormProps> = ({ info, setInfo }) => {
  // const dispatch = useDispatch();
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const addresses = useSelector((state: RootState) => state.user.addresses);

  useEffect(() => {
    if (addresses.length > 0) {
      const firstAddress = addresses[0]; // 取得第一筆 store
      setInfo({
        id: info.id,
        user_id: info.user_id || "", // 保留 user_id
        recipient_name: firstAddress.recipient_name || "",
        phone: firstAddress.phone || "",
        city: firstAddress.city || "",
        district: firstAddress.district || "",
        address_line: firstAddress.address_line || "",
        is_default: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addresses]);

  const handleOpenAddressModal = () => {
    setIsAddressModalOpen(true);
  };

  return (
    <>
      {/* 選擇其他地址 */}
      <div className="space-y-4">
        <AddressComponent address={info} />

        <button
          type="button"
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
          onClick={handleOpenAddressModal}
        >
          選擇地址
        </button>
      </div>

      {/* UserStore Modal */}
      {isAddressModalOpen && (
        <UserAddress
          addresses={addresses}
          currentAddressId={info.id}
          onSelectAddress={(address) => {
            setInfo({
              ...info,
              ...address, // 更新選中的門市資訊
            });
            setIsAddressModalOpen(false);
          }}
          onClose={() => setIsAddressModalOpen(false)}
          isAddressModalOpen={isAddressModalOpen}
        />
      )}
    </>
  );
};

export default DeliveryForm;
