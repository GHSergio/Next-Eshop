export interface CreditCardInfo {
  user_id: string;
  card_number: string;
  expiry_date: string;
  cvv: string;
}

// Errors
export interface DeliveryErrors {
  recipient_name: boolean;
  phone: boolean;
  city: boolean;
  district: boolean;
  address_line: boolean;
}

export interface CreditCardErrors {
  card_number: boolean;
  expiry_date: boolean;
  cvv: boolean;
}

export interface StoreErrors {
  recipient_name: boolean;
  phone: boolean;
  c_store: boolean;
  city: boolean;
  district: boolean;
  road_section: boolean;
  store_name: boolean;
  // store_address: boolean;
}

// 維持 Errors 作為整體結構
export interface Errors {
  delivery: DeliveryErrors;
  creditCard: CreditCardErrors;
  store: StoreErrors;
}
