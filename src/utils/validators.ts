// src/utils/validators.ts
import {
  CreditCardInfo,
  InsertStoreItem,
  InsertAddressItem,
  DeliveryErrors,
  CreditCardErrors,
  StoreErrors,
} from "@/types";
// 接收一個符合 DeliveryInfo 類型的物件，這表示它包含如 recipient_name、phone 等屬性。
// 返回一個符合 DeliveryErrors 類型的物件，每個屬性（例如 recipient_name、phone 等）是 boolean，用於指示是否有錯誤。

export const validateStoreInfo = (storeInfo: InsertStoreItem): StoreErrors => {
  // 只允許 英文、數字、空白字符、中文 -> 避免含有特殊字符
  const invalidCharsRegex = /[^a-zA-Z0-9\s\u4e00-\u9fa5]/;
  return {
    recipient_name:
      storeInfo.recipient_name.trim() === "" ||
      invalidCharsRegex.test(storeInfo.recipient_name),
    phone: !/^\d{10}$/.test(storeInfo.phone), // 10位數字
    c_store: storeInfo.c_store.trim() === "",
    city: storeInfo.city.trim() === "",
    district: storeInfo.district.trim() === "",
    road_section: storeInfo.road_section.trim() === "",
    store_name: storeInfo.store_name.trim() === "",
  };
};

export const validateDeliveryInfo = (
  deliveryInfo: InsertAddressItem
): DeliveryErrors => {
  const invalidCharsRegex = /[^a-zA-Z0-9\s\u4e00-\u9fa5]/;
  return {
    recipient_name:
      deliveryInfo.recipient_name.trim() === "" ||
      deliveryInfo.recipient_name.length > 50 ||
      invalidCharsRegex.test(deliveryInfo.recipient_name),
    phone: !/^\d{10}$/.test(deliveryInfo.phone),
    city: deliveryInfo.city.trim() === "",
    district: deliveryInfo.district.trim() === "",
    address_line:
      deliveryInfo.address_line.trim() === "" ||
      deliveryInfo.address_line.length < 5 ||
      deliveryInfo.address_line.length > 100 ||
      invalidCharsRegex.test(deliveryInfo.address_line),
  };
};

export const validateCreditCardInfo = (
  creditCardInfo: CreditCardInfo
): CreditCardErrors => {
  const expiryDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/; // MM/YY 格式
  const today = new Date();
  const currentYear = today.getFullYear() % 100; // 取兩位年份
  const currentMonth = today.getMonth() + 1;

  let isFutureDate = false;
  const [month, year] = creditCardInfo.expiry_date.split("/").map(Number);

  if (!isNaN(month) && !isNaN(year)) {
    isFutureDate =
      year > currentYear || (year === currentYear && month >= currentMonth);
  }

  return {
    card_number:
      !/^\d{16}$/.test(creditCardInfo.card_number) || // 必須是16位純數字
      creditCardInfo.card_number.trim() === "",
    expiry_date:
      !expiryDateRegex.test(creditCardInfo.expiry_date) || !isFutureDate,
    cvv:
      !/^\d{3}$/.test(creditCardInfo.cvv) || // 必須是3位數字
      creditCardInfo.cvv.trim() === "",
  };
};
