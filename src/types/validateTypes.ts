export interface DeliveryInfo {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  area: string;
  address: string;
}

export interface CreditCardInfo {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

export interface StoreInfo {
  fullName: string;
  phone: string;
  store: string;
}

export interface Errors {
  delivery: {
    fullName: boolean;
    phone: boolean;
    email: boolean;
    city: boolean;
    area: boolean;
    address: boolean;
  };
  creditCard: {
    cardNumber: boolean;
    expiryDate: boolean;
    cvv: boolean;
  };
  store: {
    fullName: boolean;
    phone: boolean;
    store: boolean;
  };
}
