// src/utils/validators.ts
import {
  // StoreInfo,
  // DeliveryInfo,
  CreditCardInfo,
  InsertStoreItem,
  InsertAddressItem,
  DeliveryErrors,
  CreditCardErrors,
  StoreErrors,
} from "@/types";
// 接收一個符合 DeliveryInfo 類型的物件，這表示它包含如 recipient_name、phone 等屬性。
// 返回一個符合 DeliveryErrors 類型的物件，每個屬性（例如 recipient_name、phone 等）是 boolean，用於指示是否有錯誤。
export const validateDeliveryInfo = (
  deliveryInfo: InsertAddressItem
): DeliveryErrors => {
  return {
    recipient_name: deliveryInfo.recipient_name.trim() === "",
    phone: !/^\d{10}$/.test(deliveryInfo.phone),
    city: deliveryInfo.city.trim() === "",
    district: deliveryInfo.district.trim() === "",
    address_line: deliveryInfo.address_line.trim() === "",
  };
};

export const validateStoreInfo = (storeInfo: InsertStoreItem): StoreErrors => {
  return {
    recipient_name: storeInfo.recipient_name.trim() === "",
    phone: !/^\d{10}$/.test(storeInfo.phone),
    c_store: storeInfo.c_store.trim() === "",
    city: storeInfo.city.trim() === "",
    district: storeInfo.district.trim() === "",
    road_section: storeInfo.road_section.trim() === "",
    store_name: storeInfo.store_name.trim() === "",
    // store_address: storeInfo.store_address.trim() === "",
  };
};

export const validateCreditCardInfo = (
  creditCardInfo: CreditCardInfo
): CreditCardErrors => {
  return {
    card_number: !/^\d{16}$/.test(creditCardInfo.card_number),
    expiry_date: creditCardInfo.expiry_date.trim() === "",
    cvv: !/^\d{3}$/.test(creditCardInfo.cvv),
  };
};
